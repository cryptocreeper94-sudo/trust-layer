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
    subject: "Welcome to DarkWave Chain",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00FFFF;">Welcome to DarkWave Chain!</h1>
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
          <li>Submit hashes to the DarkWave Chain</li>
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
        <p style="margin-top: 15px;">This hallmark is now recorded on the DarkWave Chain and can be verified at:</p>
        <p><a href="https://darkwavechain.io/explorer" style="color: #00FFFF;">https://darkwavechain.io/explorer</a></p>
        <p>— The DarkWave Team</p>
      </div>
    `,
  });
}
