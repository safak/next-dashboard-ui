# Connecting Zoom and Microsoft Teams

Teachers and admins add an online meeting to a lesson or extra class with the
camera button on the **Lessons** and **Extra Classes** pages. Students, parents
and teachers then see a **Join** (or **Start**) button under **Online classes**
on their dashboard.

Without any setup, teachers can paste a meeting link they created themselves.
The steps below let the app create meetings automatically. Add the keys to
`.env`, restart the app, then use **Settings → Online classes → Test
connection** to check them.

## Zoom

1. Sign in to the [Zoom App Marketplace](https://marketplace.zoom.us/) as a Zoom
   account admin (Pro plan or higher, so meetings aren't cut off at 40 minutes).
2. **Develop → Build App → Server-to-Server OAuth App**. Name it, e.g.
   "School app".
3. Copy **Account ID**, **Client ID** and **Client Secret**.
4. Under **Scopes**, add:
   - `meeting:write:meeting:admin`
   - `meeting:read:meeting:admin`
   - `meeting:delete:meeting:admin`
   - `user:read:user:admin` (used by the connection test)
5. **Activate** the app.
6. Add to `.env`:

   ```
   ZOOM_ACCOUNT_ID=...
   ZOOM_CLIENT_ID=...
   ZOOM_CLIENT_SECRET=...
   # Optional: the Zoom user who owns the meetings (default: the app owner)
   ZOOM_HOST_EMAIL=classes@yourschool.co.za
   ```

Each lesson gets one permanent Zoom link with a waiting room. A teacher whose
email in this app matches a licensed user on the same Zoom account is added as
an alternative host and can admit students. Otherwise the meeting owner starts
it with **Start as host**.

## Microsoft Teams

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/)
   as a Global Administrator.
2. **Applications → App registrations → New registration**. Name it, e.g.
   "School app", single tenant, no redirect URI.
3. Copy the **Application (client) ID** and **Directory (tenant) ID**.
4. **Certificates & secrets → New client secret**. Copy the secret **Value**.
   It expires, so note the date.
5. **API permissions → Add a permission → Microsoft Graph → Application
   permissions → `Calendars.ReadWrite`**, then **Grant admin consent**.
6. Choose a licensed mailbox with Teams to own the meetings, e.g.
   `classes@yourschool.co.za`.
7. Add to `.env`:

   ```
   MS_TENANT_ID=...
   MS_CLIENT_ID=...
   MS_CLIENT_SECRET=...
   MS_ORGANIZER_EMAIL=classes@yourschool.co.za
   ```

Each lesson gets a weekly recurring Teams meeting in that mailbox's calendar at
the lesson's day and time. The teacher (if their email is set in this app) is
invited, so it appears in their Outlook and Teams calendar.

> `Calendars.ReadWrite` lets the app write to every mailbox's calendar. To
> limit it to the organizer mailbox, add an
> [application access policy](https://learn.microsoft.com/graph/auth-limit-mailbox-access)
> in Exchange Online.

## Time zone

Teams meetings use the school's time zone. It defaults to the server's time
zone; set it explicitly if they differ:

```
SCHOOL_TIMEZONE=Africa/Johannesburg
```
