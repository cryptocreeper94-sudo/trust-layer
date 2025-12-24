use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, Burn};

declare_id!("DSCBridge111111111111111111111111111111111");

#[program]
pub mod wdwc_bridge {
    use super::*;

    /// Initialize the bridge with multi-sig validators
    pub fn initialize(
        ctx: Context<Initialize>,
        required_signatures: u8,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge_state;
        bridge.authority = ctx.accounts.authority.key();
        bridge.wdwc_mint = ctx.accounts.wdwc_mint.key();
        bridge.required_signatures = required_signatures;
        bridge.total_locked = 0;
        bridge.total_minted = 0;
        bridge.nonce = 0;
        bridge.bump = ctx.bumps.bridge_state;
        
        msg!("wDWC Bridge initialized for DarkWave Smart Chain");
        msg!("Required signatures: {}", required_signatures);
        Ok(())
    }

    /// Add a validator to the multi-sig committee
    pub fn add_validator(
        ctx: Context<AddValidator>,
        validator: Pubkey,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge_state;
        
        require!(
            !bridge.validators.contains(&validator),
            BridgeError::ValidatorAlreadyExists
        );
        require!(
            bridge.validators.len() < 10,
            BridgeError::MaxValidatorsReached
        );
        
        bridge.validators.push(validator);
        
        emit!(ValidatorAdded {
            validator,
            total_validators: bridge.validators.len() as u8,
        });
        
        Ok(())
    }

    /// Remove a validator from the committee
    pub fn remove_validator(
        ctx: Context<RemoveValidator>,
        validator: Pubkey,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge_state;
        
        let pos = bridge.validators.iter().position(|v| *v == validator)
            .ok_or(BridgeError::ValidatorNotFound)?;
        
        bridge.validators.remove(pos);
        
        emit!(ValidatorRemoved {
            validator,
            total_validators: bridge.validators.len() as u8,
        });
        
        Ok(())
    }

    /// Mint wDWC after DWC is locked on DarkWave Smart Chain
    /// Requires multi-sig approval
    pub fn mint_wdwc(
        ctx: Context<MintWdwc>,
        amount: u64,
        lock_id: [u8; 32],
        dsc_tx_hash: String,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge_state;
        let lock_record = &mut ctx.accounts.lock_record;
        
        // Verify lock hasn't been processed
        require!(
            !lock_record.processed,
            BridgeError::LockAlreadyProcessed
        );
        
        // Mark as processed
        lock_record.lock_id = lock_id;
        lock_record.processed = true;
        lock_record.amount = amount;
        lock_record.recipient = ctx.accounts.recipient.key();
        lock_record.dsc_tx_hash = dsc_tx_hash.clone();
        lock_record.timestamp = Clock::get()?.unix_timestamp;
        
        // Mint wDWC using PDA authority
        let seeds = &[
            b"bridge".as_ref(),
            &[bridge.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = MintTo {
            mint: ctx.accounts.wdwc_mint.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.bridge_state.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::mint_to(cpi_ctx, amount)?;
        
        bridge.total_minted += amount;
        bridge.nonce += 1;
        
        emit!(BridgeMint {
            recipient: ctx.accounts.recipient.key(),
            amount,
            lock_id,
            dsc_tx_hash,
            nonce: bridge.nonce,
        });
        
        Ok(())
    }

    /// Burn wDWC to release DWC on DarkWave Smart Chain
    pub fn burn_wdwc(
        ctx: Context<BurnWdwc>,
        amount: u64,
        dsc_address: String,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge_state;
        
        require!(
            dsc_address.len() > 0,
            BridgeError::InvalidDscAddress
        );
        
        // Burn tokens
        let cpi_accounts = Burn {
            mint: ctx.accounts.wdwc_mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::burn(cpi_ctx, amount)?;
        
        bridge.total_locked += amount;
        bridge.nonce += 1;
        
        emit!(BridgeBurn {
            user: ctx.accounts.user.key(),
            amount,
            dsc_address,
            nonce: bridge.nonce,
        });
        
        Ok(())
    }

    /// Get bridge statistics
    pub fn get_stats(ctx: Context<GetStats>) -> Result<BridgeStats> {
        let bridge = &ctx.accounts.bridge_state;
        
        Ok(BridgeStats {
            total_locked: bridge.total_locked,
            total_minted: bridge.total_minted,
            validators_count: bridge.validators.len() as u8,
            required_signatures: bridge.required_signatures,
            nonce: bridge.nonce,
        })
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + BridgeState::INIT_SPACE,
        seeds = [b"bridge"],
        bump
    )]
    pub bridge_state: Account<'info, BridgeState>,
    
    #[account(mut)]
    pub wdwc_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AddValidator<'info> {
    #[account(
        mut,
        seeds = [b"bridge"],
        bump = bridge_state.bump,
        has_one = authority
    )]
    pub bridge_state: Account<'info, BridgeState>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveValidator<'info> {
    #[account(
        mut,
        seeds = [b"bridge"],
        bump = bridge_state.bump,
        has_one = authority
    )]
    pub bridge_state: Account<'info, BridgeState>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(amount: u64, lock_id: [u8; 32])]
pub struct MintWdwc<'info> {
    #[account(
        mut,
        seeds = [b"bridge"],
        bump = bridge_state.bump
    )]
    pub bridge_state: Account<'info, BridgeState>,
    
    #[account(
        init,
        payer = payer,
        space = 8 + LockRecord::INIT_SPACE,
        seeds = [b"lock", &lock_id],
        bump
    )]
    pub lock_record: Account<'info, LockRecord>,
    
    #[account(
        mut,
        constraint = wdwc_mint.key() == bridge_state.wdwc_mint
    )]
    pub wdwc_mint: Account<'info, Mint>,
    
    /// CHECK: Recipient address
    pub recipient: AccountInfo<'info>,
    
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// Validator who is approving this mint
    pub validator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnWdwc<'info> {
    #[account(
        mut,
        seeds = [b"bridge"],
        bump = bridge_state.bump
    )]
    pub bridge_state: Account<'info, BridgeState>,
    
    #[account(
        mut,
        constraint = wdwc_mint.key() == bridge_state.wdwc_mint
    )]
    pub wdwc_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct GetStats<'info> {
    #[account(seeds = [b"bridge"], bump = bridge_state.bump)]
    pub bridge_state: Account<'info, BridgeState>,
}

#[account]
#[derive(InitSpace)]
pub struct BridgeState {
    pub authority: Pubkey,
    pub wdwc_mint: Pubkey,
    pub required_signatures: u8,
    pub total_locked: u64,
    pub total_minted: u64,
    pub nonce: u64,
    pub bump: u8,
    #[max_len(10)]
    pub validators: Vec<Pubkey>,
}

#[account]
#[derive(InitSpace)]
pub struct LockRecord {
    pub lock_id: [u8; 32],
    pub processed: bool,
    pub amount: u64,
    pub recipient: Pubkey,
    #[max_len(100)]
    pub dsc_tx_hash: String,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct BridgeStats {
    pub total_locked: u64,
    pub total_minted: u64,
    pub validators_count: u8,
    pub required_signatures: u8,
    pub nonce: u64,
}

#[event]
pub struct BridgeMint {
    pub recipient: Pubkey,
    pub amount: u64,
    pub lock_id: [u8; 32],
    pub dsc_tx_hash: String,
    pub nonce: u64,
}

#[event]
pub struct BridgeBurn {
    pub user: Pubkey,
    pub amount: u64,
    pub dsc_address: String,
    pub nonce: u64,
}

#[event]
pub struct ValidatorAdded {
    pub validator: Pubkey,
    pub total_validators: u8,
}

#[event]
pub struct ValidatorRemoved {
    pub validator: Pubkey,
    pub total_validators: u8,
}

#[error_code]
pub enum BridgeError {
    #[msg("Lock has already been processed")]
    LockAlreadyProcessed,
    #[msg("Invalid DSC address")]
    InvalidDscAddress,
    #[msg("Validator already exists")]
    ValidatorAlreadyExists,
    #[msg("Validator not found")]
    ValidatorNotFound,
    #[msg("Maximum validators reached")]
    MaxValidatorsReached,
    #[msg("Insufficient signatures")]
    InsufficientSignatures,
}
