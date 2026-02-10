import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

const REPLY_TO_EMAIL = "cryptocreeper94@gmail.com";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  const { client, fromEmail } = await getResendClient();
  
  const emailPayload: any = {
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    replyTo: options.replyTo || REPLY_TO_EMAIL,
  };
  
  if (options.html) {
    emailPayload.html = options.html;
  }
  if (options.text) {
    emailPayload.text = options.text;
  }
  
  const result = await client.emails.send(emailPayload);
  return result;
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Welcome to Trust Layer",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00FFFF;">Welcome to Trust Layer!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining the DarkWave ecosystem. You're now part of the next generation of blockchain technology.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Explore the blockchain via <a href="https://darkwavechain.io/explorer">DarkWaveScan</a></li>
          <li>Register as a developer and get API keys</li>
          <li>Submit hashes and generate hallmarks</li>
        </ul>
        <p>If you have any questions, just reply to this email.</p>
        <p>— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendApiKeyEmail(to: string, name: string, apiKey: string, appName: string) {
  return sendEmail({
    to,
    subject: `Your DarkWave API Key for ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00FFFF;">Your API Key is Ready</h1>
        <p>Hi ${name},</p>
        <p>Your API key for <strong>${appName}</strong> has been generated:</p>
        <div style="background: #1a1a2e; color: #00FFFF; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all;">
          ${apiKey}
        </div>
        <p style="color: #ff6b6b; margin-top: 15px;"><strong>Important:</strong> Keep this key secure and never share it publicly.</p>
        <p>You can now use this key to:</p>
        <ul>
          <li>Submit hashes to the Trust Layer</li>
          <li>Generate hallmarks for your products</li>
          <li>Access the DarkWave API</li>
        </ul>
        <p>Need help? Reply to this email.</p>
        <p>— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendHallmarkEmail(to: string, hallmarkId: string, productName: string) {
  return sendEmail({
    to,
    subject: `Hallmark Generated: ${hallmarkId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00FFFF;">Hallmark Created Successfully</h1>
        <p>A new hallmark has been generated for <strong>${productName}</strong>:</p>
        <div style="background: #1a1a2e; color: #00FFFF; padding: 20px; border-radius: 8px; text-align: center;">
          <span style="font-size: 24px; font-weight: bold;">${hallmarkId}</span>
        </div>
        <p style="margin-top: 15px;">This hallmark is now recorded on the Trust Layer and can be verified at:</p>
        <p><a href="https://darkwavechain.io/explorer" style="color: #00FFFF;">https://darkwavechain.io/explorer</a></p>
        <p>— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendStakingRewardEmail(to: string, rewardAmount: string, totalStaked: string) {
  return sendEmail({
    to,
    subject: `Staking Rewards Claimed: ${rewardAmount} SIG`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00FFFF; margin-bottom: 20px;">Staking Rewards Claimed!</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Rewards Claimed</p>
          <p style="color: #00FFFF; font-size: 32px; font-weight: bold; margin: 0;">${rewardAmount} SIG</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #888; margin: 0; font-size: 12px;">Total Staked</p>
          <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 16px;">${totalStaked} SIG</p>
        </div>
        <p style="color: #888; font-size: 12px;">Your rewards are now in your wallet. Keep staking to earn more!</p>
        <p style="color: #888; margin-top: 20px;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendLargeTransferAlert(to: string, amount: string, direction: 'sent' | 'received', txHash: string) {
  const action = direction === 'sent' ? 'Sent' : 'Received';
  const color = direction === 'sent' ? '#ff6b6b' : '#00ff88';
  
  return sendEmail({
    to,
    subject: `Large Transfer Alert: ${amount} SIG ${action}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: ${color}; margin-bottom: 20px;">Large Transfer ${action}</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Amount ${action}</p>
          <p style="color: ${color}; font-size: 32px; font-weight: bold; margin: 0;">${amount} SIG</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #888; margin: 0; font-size: 12px;">Transaction Hash</p>
          <p style="color: #00FFFF; margin: 5px 0 0 0; font-size: 12px; word-break: break-all; font-family: monospace;">${txHash}</p>
        </div>
        <p style="color: #ff6b6b; font-size: 12px;">If you did not initiate this transfer, please secure your wallet immediately.</p>
        <p style="color: #888; margin-top: 20px;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendFounderWelcomeEmail(to: string, founderNumber: number, referralCode: string) {
  return sendEmail({
    to,
    subject: `Welcome, Legacy Founder #${founderNumber}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FFD700; margin-bottom: 10px;">Welcome, Legacy Founder!</h1>
          <p style="color: #00FFFF; font-size: 24px; font-weight: bold;">You are Founder #${founderNumber}</p>
        </div>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #FFD700; margin: 0 0 15px 0;">Your Exclusive Perks</h3>
          <ul style="color: #ffffff; padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 8px;">35,000 SIG Airdrop at Mainnet Launch</li>
            <li style="margin-bottom: 8px;">Unlimited AI Analysis (Crypto & Stocks)</li>
            <li style="margin-bottom: 8px;">StrikeAgent Sniper Bot Access</li>
            <li style="margin-bottom: 8px;">Founding Member Badge (Forever)</li>
            <li style="margin-bottom: 8px;">Priority Staking Pool Access</li>
            <li>No Recurring Billing - Lifetime Access</li>
          </ul>
        </div>
        <div style="background: #1a1a2e; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Your Referral Code</p>
          <p style="color: #00FFFF; font-size: 24px; font-weight: bold; margin: 0; font-family: monospace;">${referralCode}</p>
          <p style="color: #888; margin: 10px 0 0 0; font-size: 12px;">Share this code and earn bonus rewards for each referral!</p>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">Thank you for believing in Trust Layer. Together, we're building the future of trust infrastructure.</p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendReferralBonusEmail(to: string, referralCount: number, bonusAmount: string) {
  return sendEmail({
    to,
    subject: `Referral Bonus: ${bonusAmount} SIG Earned!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00ff88; margin-bottom: 20px; text-align: center;">Referral Bonus Earned!</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">You Earned</p>
          <p style="color: #00ff88; font-size: 32px; font-weight: bold; margin: 0;">${bonusAmount} SIG</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 12px;">Total Referrals</p>
          <p style="color: #FFD700; margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">${referralCount}</p>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">Keep sharing your referral code to earn more rewards!</p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendPresaleConfirmationEmail(to: string, amountPaid: string, tier: string, tokenAmount: number, bonusTokens: number) {
  const tierNames: Record<string, string> = {
    genesis: "Genesis",
    founder: "Founder",
    pioneer: "Pioneer",
    early_bird: "Early Bird",
  };
  const tierName = tierNames[tier] || tier;
  const totalTokens = tokenAmount + bonusTokens;
  
  return sendEmail({
    to,
    subject: `Signal (SIG) Purchase Confirmed - ${tierName} Tier`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00FFFF; margin-bottom: 20px; text-align: center;">Purchase Confirmed!</h1>
        <p style="text-align: center; color: #888;">Welcome to the DarkWave ecosystem, early adopter!</p>
        
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Your Signal Allocation</p>
          <p style="color: #00FFFF; font-size: 36px; font-weight: bold; margin: 0;">${totalTokens.toLocaleString()} SIG</p>
          <p style="color: #00ff88; margin-top: 10px; font-size: 14px;">Includes +${bonusTokens.toLocaleString()} bonus Signal</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">Amount Paid</p>
            <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">$${amountPaid}</p>
          </div>
          <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">Tier</p>
            <p style="color: #A855F7; margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">${tierName}</p>
          </div>
        </div>
        
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00FFFF;">
          <h3 style="color: #00FFFF; margin: 0 0 10px 0;">What's Next?</h3>
          <ul style="color: #888; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Your Signal (SIG) will be available when mainnet launches</li>
            <li>We're milestone-based — no fixed date, just real progress</li>
            <li>20% released at TGE, 80% vested over 12 months</li>
            <li>You'll receive updates and early access announcements</li>
            <li>Join our community to stay connected</li>
          </ul>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center;">Thank you for being an early supporter of Trust Layer!</p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendBridgeCompletionEmail(to: string, amount: string, fromChain: string, toChain: string, txHash: string) {
  return sendEmail({
    to,
    subject: `Bridge Complete: ${amount} Transferred`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00FFFF; margin-bottom: 20px; text-align: center;">Bridge Transfer Complete!</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Amount Bridged</p>
          <p style="color: #00FFFF; font-size: 32px; font-weight: bold; margin: 0;">${amount}</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
          <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
            <p style="color: #888; margin: 0; font-size: 12px;">From</p>
            <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">${fromChain}</p>
          </div>
          <span style="color: #00FFFF; font-size: 20px;">→</span>
          <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; text-align: center; flex: 1;">
            <p style="color: #888; margin: 0; font-size: 12px;">To</p>
            <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">${toChain}</p>
          </div>
        </div>
        <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #888; margin: 0; font-size: 12px;">Transaction Hash</p>
          <p style="color: #00FFFF; margin: 5px 0 0 0; font-size: 12px; word-break: break-all; font-family: monospace;">${txHash}</p>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">Your Signal has been successfully bridged and is now available on ${toChain}.</p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendEmail({
    to,
    subject: "Reset Your Password - DarkWave",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00FFFF; margin-bottom: 20px; text-align: center;">Password Reset Request</h1>
        <p style="color: #888; text-align: center; margin-bottom: 30px;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #a855f7); color: #ffffff; font-weight: bold; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #888; margin: 0; font-size: 12px;">Or copy this link:</p>
          <p style="color: #00FFFF; margin: 5px 0 0 0; font-size: 12px; word-break: break-all; font-family: monospace;">${resetLink}</p>
        </div>
        <p style="color: #ff6b6b; font-size: 12px; text-align: center;">
          This link expires in 1 hour. If you didn't request this, you can ignore this email.
        </p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendEmailVerificationCode(to: string, code: string, name: string) {
  return sendEmail({
    to,
    subject: `Your DarkWave Verification Code: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00FFFF; margin-bottom: 10px;">Verify Your Email</h1>
          <p style="color: #888;">Welcome to DarkWave, ${name}!</p>
        </div>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 15px 0; font-size: 14px;">Your verification code is:</p>
          <p style="color: #00FFFF; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: monospace;">${code}</p>
        </div>
        <p style="color: #888; font-size: 14px; text-align: center;">
          Enter this code on the verification page to complete your registration.
        </p>
        <p style="color: #ff6b6b; font-size: 12px; text-align: center; margin-top: 20px;">
          This code expires in 10 minutes. If you didn't create an account, you can ignore this email.
        </p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendWalletCreationReminder(to: string, name: string, tokenAmount: number) {
  return sendEmail({
    to,
    subject: `Action Required: Create Your Trust Layer Wallet`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #FFD700; margin-bottom: 10px;">You're In The System!</h1>
          <p style="color: #888;">Hi${name ? ` ${name}` : ''},</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Your Signal Allocation</p>
          <p style="color: #00FFFF; font-size: 36px; font-weight: bold; margin: 0;">${tokenAmount.toLocaleString()} SIG</p>
          <p style="color: #00ff88; margin-top: 10px; font-size: 14px;">Confirmed and secured for you</p>
        </div>
        
        <div style="background: #1a1a2e; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #00FFFF;">
          <h3 style="color: #00FFFF; margin: 0 0 10px 0;">Your Next Step: Create Your Wallet</h3>
          <p style="color: #888; margin: 0; font-size: 14px;">
            Before the Signal Generation Event, you'll need a Trust Layer wallet to receive your airdrop. 
            We'll notify you when the TGE date is announced - but you can create your wallet anytime!
          </p>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="https://dwtl.io/wallet" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #a855f7); color: #ffffff; font-weight: bold; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-size: 16px;">
            Create Wallet Now
          </a>
        </div>
        
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #FFD700; margin: 0 0 10px 0;">Milestone-Based Launch</h3>
          <p style="color: #888; margin: 0; font-size: 14px;">
            We're building in public and launching when key milestones are hit - not on a fixed date. 
            You'll receive updates as we progress. Your allocation is locked in and waiting for you!
          </p>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center;">
          Questions? Just reply to this email - we're here to help!
        </p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendSignupWelcomeEmail(to: string, name: string, referralCode?: string) {
  return sendEmail({
    to,
    subject: `Welcome to Trust Layer - You're In!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00FFFF; margin-bottom: 10px;">Welcome to Trust Layer!</h1>
          <p style="color: #888;">Hi${name ? ` ${name}` : ''}, thanks for joining us!</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #FFD700; margin: 0 0 15px 0;">What's Next?</h3>
          <ul style="color: #ffffff; padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 10px;">Explore the <a href="https://dwtl.io" style="color: #00FFFF;">presale</a> to own Signal early</li>
            <li style="margin-bottom: 10px;">Join our community and earn Shells through activities</li>
            <li style="margin-bottom: 10px;">Create your wallet when you're ready - we'll remind you before launch</li>
            ${referralCode ? `<li style="margin-bottom: 10px;">Share your referral code: <strong style="color: #00FFFF;">${referralCode}</strong></li>` : ''}
          </ul>
        </div>
        
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00FFFF;">
          <h3 style="color: #00FFFF; margin: 0 0 10px 0;">Milestone-Based Launch</h3>
          <p style="color: #888; margin: 0; font-size: 14px;">
            We're building in public and will announce the Signal Generation Event when key milestones are hit. 
            You'll need a Trust Layer wallet to receive your airdrop - we'll send you a reminder when it's time!
          </p>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="https://dwtl.io/home" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #a855f7); color: #ffffff; font-weight: bold; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-size: 16px;">
            Explore Trust Layer
          </a>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center;">
          Questions? Just reply to this email - we're here to help!
        </p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendBusinessApprovalEmail(to: string, businessName: string, isMainStreet: boolean) {
  const mainStreetBadge = isMainStreet ? `
    <div style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
      <p style="color: #ffffff; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">🏪 Legacy Main Street Member 🏪</p>
      <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0;">Virtual Storefront Granted in Chronicles!</p>
      <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 10px 0 0 0;">You're among the first businesses in the ecosystem. Your storefront will appear in city centers across all eras.</p>
    </div>
  ` : '';

  return sendEmail({
    to,
    subject: `Business Verified: ${businessName} is Now a Trust Layer Member!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00FF88; margin-bottom: 20px; text-align: center;">✓ Business Verified!</h1>
        
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Welcome to the Trust Layer</p>
          <p style="color: #00FFFF; font-size: 24px; font-weight: bold; margin: 0;">${businessName}</p>
        </div>
        
        ${mainStreetBadge}
        
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00FF88;">
          <h3 style="color: #00FF88; margin: 0 0 15px 0;">Your Business Benefits</h3>
          <ul style="color: #888; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li><strong style="color: #fff;">API Access</strong> - Generate API keys for Trust Layer integration</li>
            <li><strong style="color: #fff;">Webhooks</strong> - Receive real-time event notifications</li>
            <li><strong style="color: #fff;">2.5x Referral Bonus</strong> - Earn more from referrals</li>
            <li><strong style="color: #fff;">Team Management</strong> - Invite your team members</li>
            <li><strong style="color: #fff;">Trust Layer Hash</strong> - Verified identity on the blockchain</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="https://dwtl.io/business-portal" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #a855f7); color: #ffffff; font-weight: bold; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-size: 16px;">
            Access Business Portal
          </a>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center;">
          Questions? Reply to this email - we're here to help your business succeed!
        </p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendBusinessRejectionEmail(to: string, businessName: string, reason: string) {
  return sendEmail({
    to,
    subject: `Business Application Update: ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #f59e0b; margin-bottom: 20px; text-align: center;">Application Update</h1>
        
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Business Application Status</p>
          <p style="color: #f59e0b; font-size: 24px; font-weight: bold; margin: 0;">${businessName}</p>
        </div>
        
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
          <h3 style="color: #f59e0b; margin: 0 0 10px 0;">Review Feedback</h3>
          <p style="color: #ffffff; margin: 0; line-height: 1.6;">${reason}</p>
        </div>
        
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #00FFFF; margin: 0 0 10px 0;">What You Can Do</h3>
          <ul style="color: #888; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Review the feedback and address any concerns</li>
            <li>Gather additional documentation if needed</li>
            <li>Submit a new application when ready</li>
            <li>Contact us if you have questions</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="https://dwtl.io/business-application" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #a855f7); color: #ffffff; font-weight: bold; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-size: 16px;">
            Submit New Application
          </a>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center;">
          Need help? Reply to this email and we'll assist you through the process.
        </p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}
