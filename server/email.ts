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
    subject: "Welcome to DarkWave Smart Chain",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00FFFF;">Welcome to DarkWave Smart Chain!</h1>
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
          <li>Submit hashes to the DarkWave Smart Chain</li>
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
        <p style="margin-top: 15px;">This hallmark is now recorded on the DarkWave Smart Chain and can be verified at:</p>
        <p><a href="https://darkwavechain.io/explorer" style="color: #00FFFF;">https://darkwavechain.io/explorer</a></p>
        <p>— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendStakingRewardEmail(to: string, rewardAmount: string, totalStaked: string) {
  return sendEmail({
    to,
    subject: `Staking Rewards Claimed: ${rewardAmount} DWC`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00FFFF; margin-bottom: 20px;">Staking Rewards Claimed!</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Rewards Claimed</p>
          <p style="color: #00FFFF; font-size: 32px; font-weight: bold; margin: 0;">${rewardAmount} DWC</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #888; margin: 0; font-size: 12px;">Total Staked</p>
          <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 16px;">${totalStaked} DWC</p>
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
    subject: `Large Transfer Alert: ${amount} DWC ${action}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: ${color}; margin-bottom: 20px;">Large Transfer ${action}</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">Amount ${action}</p>
          <p style="color: ${color}; font-size: 32px; font-weight: bold; margin: 0;">${amount} DWC</p>
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
            <li style="margin-bottom: 8px;">35,000 DWC Airdrop on Launch (Feb 14, 2026)</li>
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
        <p style="color: #888; font-size: 12px; text-align: center;">Thank you for believing in DarkWave Smart Chain. Together, we're building the future of blockchain.</p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}

export async function sendReferralBonusEmail(to: string, referralCount: number, bonusAmount: string) {
  return sendEmail({
    to,
    subject: `Referral Bonus: ${bonusAmount} DWC Earned!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #00ff88; margin-bottom: 20px; text-align: center;">Referral Bonus Earned!</h1>
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="color: #888; margin: 0 0 10px 0; font-size: 14px;">You Earned</p>
          <p style="color: #00ff88; font-size: 32px; font-weight: bold; margin: 0;">${bonusAmount} DWC</p>
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
        <p style="color: #888; font-size: 12px; text-align: center;">Your tokens have been successfully bridged and are now available on ${toChain}.</p>
        <p style="color: #888; margin-top: 20px; text-align: center;">— The DarkWave Team</p>
      </div>
    `,
  });
}
