# Setting up the system for a new school

Each school gets its **own copy** (installation) of the system with its own
database, files and branding. Nothing is shared between schools.

## 1. Install a fresh copy

```bash
git clone https://github.com/LalamaniWise/next-dashboard-ui.git school-name
cd school-name
npm install
```

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
# A long random secret. Generate one with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
AUTH_SECRET=...
SCHOOL_TIMEZONE=Africa/Johannesburg
```

Create the empty database, then build and start:

```bash
npx prisma migrate deploy
npm run build
npm run start
```

**Don't run `npm run seed`** for a real school. It fills the database with
made-up teachers and learners for demos.

## 2. First-run setup

Open the site and go to **/sign-in**. A new installation has no accounts, so
you're taken to **/setup** automatically. Enter:

- the school's name
- the first and last grade the school teaches
- the first administrator's username and password

The setup page only works while there are no accounts. After that it sends
everyone to sign in.

## 3. Work through the setup checklist

Sign in and open **Settings**. The **Setup checklist** at the top shows what's
left. In order:

1. **School:** name and academic year.
2. **Logo** and **Public website:** tagline, about text, contact details,
   WhatsApp number and accent colour.
3. **Grades**, if more are needed.
4. **Subjects** (menu → Subjects): add the school's subjects and mark each as
   online, in person, or both.
5. **Teachers** (menu → Teachers), then assign each subject its teachers.
6. **Classes** (menu → Classes) for each grade.
7. **Fees** (menu → Fees → Fee rates & settings): monthly fees per lesson type,
   registration fee, sibling discount, due day and banking details.
8. Optional: **Zoom / Microsoft Teams**. See `online-classes-setup.md`.

## 4. Go live

- Share the website address. Learners register at **/register**, and parents
  link up with the learner's student number.
- Approve registrations under **Registrations**.
- Each month, create invoices under **Fees**.

## Hosting

The system runs on any server that can run Node.js 20+. Uploaded files
(study material and logos) are stored in the `storage/` folder, and the
database in `prisma/dev.db`. **Back up both regularly.**
