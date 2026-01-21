# Email Verification System - Handoff Document

**Date:** January 21, 2026  
**Status:** Live and Working  

---

## What Was Built

We added **email verification** to DarkWave Trust Layer. Now every new user must verify their email address before they can fully participate in the ecosystem.

### How It Works

1. **User signs up** with email, password, name, and username
2. **Verification screen appears** asking for 6-digit code
3. **Email is sent** via Resend with the verification code
4. **User enters code** to complete registration
5. **1,000 Shells awarded** as welcome bonus after verification
6. **Full access granted** - user can now earn, spend, and refer

### Why This Matters

- **Prevents bot accounts** from claiming Shell rewards
- **Ensures real users** in the community
- **Protects referral program** from abuse
- **Builds quality user base** for 150K+ community goal

---

## Welcome Bonus

Every verified user receives **1,000 Shells** immediately after email verification.

- Value: $1.00 (at 1 Shell = $0.001)
- Shows up in their wallet right away
- Gives them something to see and convert
- Transaction shows as "Welcome bonus for email verification"

---

## Coming Soon: Phone Verification (Optional)

We will be adding **phone verification** as an additional option:

- **SMS verification** via Twilio (toll-free verification pending - usually 48 hours)
- Users can choose: Email only OR Email + Phone
- Phone-verified users may get extra perks (higher trust level)
- Good for recovery if email access is lost

---

## Step-by-Step: How to Get Your Referral Link and See Shells

### Step 1: Sign Up
1. Go to the DarkWave portal (dwtl.io)
2. Click **"Sign In"** button in the top right
3. Click **"Sign Up"** at the bottom of the login form
4. Fill in your details:
   - Your Name
   - Choose a Username
   - Email address
   - Password (at least 6 characters)
5. Click **"Create Account"**

### Step 2: Verify Your Email
1. You will see a verification screen asking for a 6-digit code
2. Check your email inbox (also check spam folder)
3. Find the email from DarkWave with your code
4. Enter the 6-digit code in the boxes
5. Click **"Verify Email"**
6. You will see: **"Congrats! Your first signup bonus is YOU!"**
7. You receive **1,000 Shells** in your wallet!

### Step 3: Find Your Referral Link
1. After verification, you are logged in
2. Click on your profile icon (top right) or go to the menu
3. Look for **"Referral Program"** or **"Refer & Earn"**
4. You can also go directly to: `/referral-program`
5. Your unique referral link will be displayed
6. Copy and share with friends!

### Step 4: See Your Shells Balance
1. Click on your profile or wallet icon
2. Go to **"Shell Wallet"** or **"My Shells"**
3. You can also visit: `/shells` or `/wallet`
4. Your balance shows:
   - Total Shells
   - Transaction history (including your welcome bonus)
   - Conversion calculator

### Step 5: Use the Conversion Calculator
1. On the Shells page, find the **"Convert to Signal"** section
2. The calculator shows:
   - Your current Shell balance
   - Live conversion rate: **10 Shells = 1 SIG**
   - SIG price at TGE: **$0.01**
3. Enter how many Shells to convert
4. See exactly how much SIG you will receive
5. The calculator updates in real-time with live counts

---

## Referral Rewards (Locked Values)

| Period | Shells Per Signup |
|--------|------------------|
| Presale (Now) | 1,000 Shells |
| Post-Launch | 500 Shells |

**Note:** Referral program is PERMANENT - continues after presale with reduced rates.

---

## Conversion Reference

| Currency | Value | Converts To |
|----------|-------|-------------|
| 1 Shell | $0.001 | 0.1 SIG |
| 10 Shells | $0.01 | 1 SIG |
| 1,000 Shells | $1.00 | 100 SIG |
| 1 SIG (at TGE) | $0.01 | - |
| 1 Echo | $0.0001 | NOT convertible |

---

## Technical Details

### Files Changed
- `client/src/components/simple-login.tsx` - Added verification UI
- `server/routes.ts` - Email verification endpoints + 1000 shells bonus
- `server/email.ts` - Resend email service
- `shared/schema.ts` - emailVerified column, emailVerificationCodes table

### Database
- `users.emailVerified` - Boolean, tracks verification status
- `emailVerificationCodes` - Stores codes with 10-minute expiry

### API Endpoints
- `POST /api/auth/verify-email` - Submit verification code
- `POST /api/auth/resend-verification` - Request new code (60s cooldown)

---

## Questions?

Contact the development team if you need help with the verification flow or referral system.
