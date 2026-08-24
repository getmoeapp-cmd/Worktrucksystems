WORKTRUCK SYSTEMS — UPLOAD INSTRUCTIONS
========================================

TWO FILES. Folder structure matters.

Your repo should end up looking like:

   Worktrucksystems/
     api/
       lead.js          <-- NEW, must be inside a folder named "api"
     index.html
     start.html         <-- REPLACE the existing one
     privacy.html
     terms.html
     ...

STEP 1 — Upload both files
   Drag this whole unzipped folder's contents into GitHub's uploader.
   It preserves the api/ folder automatically.
   Commit.

STEP 2 — Vercel environment variables
   Vercel -> your project -> Settings -> Environment Variables

   Name:  GHL_TOKEN
   Value: your pit- token from GHL Private Integrations

   Name:  GHL_LOCATION_ID
   Value: ljnjsKRPJSiGC2ePan7L

   Apply to Production, Preview, and Development.

STEP 3 — Redeploy
   Deployments -> latest -> ... -> Redeploy
   Environment variables only apply to builds created AFTER they are set.
   The commit from step 1 will NOT have them.

STEP 4 — Test
   Go to worktrucksystems.com/start.html
   Open the console (F12)
   Fill out screen 1 and submit.

   Console clean          -> check Contacts in the Sales sub-account
   "Lead not saved: {...}" -> copy that whole object and send it to me.
                              It contains GHL's exact rejection reason.

STEP 5 — Workflow trigger
   Funnel Intake workflow: delete the Inbound Webhook trigger.
   Replace with:  Contact Tag Added  ->  start-funnel

   The function applies that tag on every contact it creates.
   Speed to Lead should get the same trigger added.

NOTES
   - GHL_TOKEN never appears in the browser. It lives only on Vercel's server.
   - Once this works, delete that Private Integration in GHL and make a fresh
     token. The current one has been pasted into a chat window.
