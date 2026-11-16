# Setting up email

The app sends email for two things:

- **Forgot password**: a one-time link to choose a new password (valid for 30 minutes).
- **Two-step sign-in**: a 6-digit code each time someone with it switched on signs in.

Until email is set up, "Forgot password" still works: every request goes to the
admins (Settings → Reset a password), and two-step sign-in can't be switched on.

## 1. Add these lines to `.env`

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.school@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM="Capital Mathematics Studies <your.school@gmail.com>"

# The address people use to open the app, used in reset links.
# Leave it out while the app only runs on this computer or your local network.
# APP_URL=https://app.capitalmaths.co.za
```

Then restart the app (`npm run build` is not needed for `.env` changes, only a restart).

## 2. Get the SMTP details

### Gmail (free, about 500 emails a day)

1. Use a Gmail account for the school, not a personal one.
2. Switch on 2-Step Verification for that Google account (myaccount.google.com → Security).
3. Go to myaccount.google.com/apppasswords, create an app password called "School app".
4. Put the 16-letter password (without spaces) in `SMTP_PASS`.

### Outlook / Microsoft 365

```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=office@yourschool.co.za
SMTP_PASS=the mailbox password
```

Your Microsoft 365 admin may need to allow "Authenticated SMTP" for the mailbox.

### Resend, Brevo or another email service

Use the SMTP host, port, username and password from the service's dashboard.
These are better if you send a lot of email or use your own domain.

## 3. Test it

Sign in as an admin, open **Settings → Email** and send a test email. If it
fails, the error message from the mail server is shown there.

## Notes

- People need an email address on their account to get reset links and codes.
  They can add and confirm one on their **Profile** page; admins can also enter
  it on a teacher's, student's or parent's details.
- If someone with two-step sign-in loses access to their email, an admin uses
  **Settings → Reset a password**. That gives them a temporary password and
  switches two-step sign-in off; they can switch it on again afterwards.
