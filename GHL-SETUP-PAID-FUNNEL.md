# Paid-ads funnel — what the page does vs. what GHL must do

The new /start.html posts ONE submission to /api/lead with `funnel_stage: complete`,
so a single submit adds THREE tags at once:

| tag           | fires (existing or new)                                        |
|---------------|----------------------------------------------------------------|
| start-funnel  | EXISTING "Funnel Intake" workflow → SMS to Ronnie (+13476284767) |
| funnel-done   | EXISTING "Funnel Complete" workflow → opportunity in WTS Sales → New Lead, $297, + SMS to Ronnie |
| paid-ad-lead  | NEW tag. No workflow attached yet — use it for smart lists, ad audiences, and the workflows below |

Contact fields written: first/last name, phone, email, companyName (business name),
custom fields `trade` and `biggest_problem` (their tap-to-select answer),
source "Facebook Ads — /start.html", plus UTM/fbclid attribution.

After submitting, the page immediately shows the demo calendar
(demo-xoqfmqyc2) with name/email/phone prefilled. Booking confirmations,
reminders, and pipeline movement on booking are whatever that calendar
already has configured in GHL.

## Build these two things in GHL (the page can't do them)

### 1. Instant SMS to the prospect + unbooked-lead chase
Workflow: **"Paid LP — book the demo"**
- TRIGGER: Contact Tag Added → `paid-ad-lead`
- ACTION 1: SMS to contact, immediately:
  > Hey {{contact.first_name}}, Ronnie from WorkTruck Systems here. Got your info.
  > Here's the link to grab a time for your demo: <calendar link>. If you have any
  > questions, just text me here.
  For the calendar link use either the booking page URL or
  `https://worktrucksystems.com/start.html?calendar=1` — that lands them straight
  on the calendar step, skipping the form.
- WAIT: 1 hour → IF/ELSE: has appointment? → if NO, SMS nudge #2.
- WAIT: 1 day → same check → nudge #3. Stop after that.
- Workflow settings: **stop the contact in this workflow when an appointment is booked**
  (add the Appointment Booked goal/exit, or a condition on each branch).

### 2. Booked-demo pipeline stage
On the demo calendar's booking automation (or a workflow triggered by
Customer Booked Appointment on that calendar):
- Move the WTS Sales opportunity → **Demo Booked** stage (create the stage if it doesn't exist).
- Confirmation SMS + email to the prospect, reminder sequence, and a
  "demo booked" SMS to Ronnie — keep/extend whatever the calendar already sends.

## Meta Pixel
The pixel block at the top of /start.html is still commented out with
YOUR_PIXEL_ID. Paste the real ID and uncomment; the page then fires:
PageView, LeadFormStarted (custom), Lead, CalendarViewed (custom),
and Schedule on booking (best-effort listener on the widget).

## The old video funnel
Archived unchanged at /start-videos.html (not linked anywhere, noindex).
Its logic, the 12-system list, and the VIDEOS config are all still there
if you ever want it back.
