# GHL Workflow Audit — Work Truck Systems

Sub-account: Work Truck Systems (Howard Beach, NY) · `ljnjsKRPJSiGC2ePan7L`
Audit date: 1 Sep 2026 · **Nothing changed. This is a proposal.**

---

## Headline findings

**1. The no-booking follow-up gap is REAL — now confirmed.**
Nothing in the account contacts a lead who completes the form but never books a time. Proven below.

**2. `Speed to Lead` is NOT dumpster legacy — do not delete it.**
Its trigger is **"Facebook lead form submitted."** It has 0 enrollments because your site form posts through the API to `/api/lead`, not through a Facebook Instant Form. It has never been able to fire. But you are about to run Facebook ads, and if you ever use Instant Forms this workflow *will* activate — and it sends an SMS **and** an Email to the contact. That is a live landmine, not dead scaffolding.

**3. `Funnel Intake` and `Funnel Complete` fire on the exact same event.**
`api/lead.js` applies both `start-funnel` and `funnel-done` on every form submission, because `start.html` always sends `funnel_stage: 'complete'`. Two workflows, two internal texts to you, one actual event. This is why you get "NEW LEAD" and "COMPLETED" simultaneously. `Funnel Complete` is misnamed — it means *form* complete, not *booking* complete.

**4. You have two missed-call workflows with near-identical names.**
`Auto Missed Call Text-Back` (Draft) and `Missed Call Textback` (Published). Almost certainly one is the dumpster-era original.

---

## Inventory

Status and enrollment counts below are read directly from the workflow list. Where I could not verify a trigger, it is marked **NOT VERIFIED** rather than guessed.

| # | Name | Status | Total enrolled | Active | Trigger | What it does | Can your funnel fire it? |
|---|---|---|---|---|---|---|---|
| 1 | Auto Missed Call Text-Back | **Draft** | 0 | 0 | NOT VERIFIED | Missed-call auto-reply | Draft — cannot fire |
| 2 | Demo Call | Published | 7 | 2 | **Customer Booked Appointment** | Confirmation SMS to contact, then reminders. Time window 11:00–20:00 | **Yes** — on booking |
| 3 | Demo No-Show Recovery | Published | 0 | 0 | NOT VERIFIED | Re-engage no-shows | Probably — no no-shows yet |
| 4 | Estimate Follow-Up | **Draft** | 0 | 0 | NOT VERIFIED | Chase unaccepted estimates | Draft — cannot fire |
| 5 | Funnel Complete | Published | 12 | 0 | **Contact Tag added includes `funnel-done`** | Create opportunity → Internal Notification to Ronnie → END | **Yes** — on form submit |
| 6 | Funnel Intake | Published | NOT VERIFIED | — | **Contact Tag added includes `start-funnel`** | Internal Notification to Ronnie → condition → Add Tag | **Yes** — on form submit |
| 7 | Missed Call Textback | Published | NOT VERIFIED | — | NOT VERIFIED | Missed-call auto-reply | Yes, if a call is missed |
| 8 | Review Engine | Published | NOT VERIFIED | — | NOT VERIFIED | Request Google reviews after a job | Not from this funnel |
| 9 | Speed to Lead | Published | 0 | 0 | **Facebook lead form submitted** (Page is Any) | Branch on `test-demo` → **SMS + Email to the contact** | **No** — you don't use FB Instant Forms |
| 10 | Stop No-Show Sequence | Published | NOT VERIFIED | — | NOT VERIFIED | Helper — halts no-show chase once someone re-books | Only alongside #3 |

---

## Proof that the no-booking gap is real

| Path | Fires when | Who it messages |
|---|---|---|
| Funnel Intake | Form submitted | **Ronnie only** |
| Funnel Complete | Form submitted | **Ronnie only** |
| Demo Call | Appointment booked | Contact — but only if they booked |
| Speed to Lead | FB Instant Form submitted | Contact — but can never fire today |

A lead who fills in the form and closes the tab receives **nothing, ever**. You get two texts about them; they hear silence.

---

## Classification

### KEEP AS IS
| Workflow | Reason |
|---|---|
| Missed Call Textback | Core product function, published, plausibly live |
| Stop No-Show Sequence | Helper for #3; harmless and only acts alongside it |

### RENAME
| Current | Proposed | Reason |
|---|---|---|
| Funnel Intake | `Lead — Form Submitted (Notify Me)` | Says what it does; "Intake" is ambiguous |
| Funnel Complete | `Lead — Form Submitted (Opportunity)` | Currently implies a booking; it does not mean that |
| Demo Call | `Appt — Booked Confirmation` | Distinguishes it from the calendar's own notification |
| Demo No-Show Recovery | `Appt — No-Show Recovery` | Consistent prefix |
| Stop No-Show Sequence | `Appt — No-Show Stop (helper)` | Marks it as a helper, not a standalone |
| Missed Call Textback | `Ops — Missed Call Textback` | Consistent prefix |
| Review Engine | `Ops — Review Request` | Consistent prefix |
| Speed to Lead | `Lead — FB Instant Form (DORMANT)` | Name currently implies it is doing something. It is not |

### DISABLE (not delete)
| Workflow | Reason |
|---|---|
| Speed to Lead | Cannot fire today, but sends contact-facing SMS + Email. If you switch to Instant Forms it wakes up unannounced. Disable until you deliberately want it |
| Estimate Follow-Up | Already Draft. Dumpster-era: you don't send estimates. Leave as Draft, rename `Legacy — Estimate Follow-Up` |
| Auto Missed Call Text-Back | Already Draft, 0 enrolled, duplicates #7. Leave Draft pending the check below |

### DELETE
**Nothing.** I am not confident enough about any of these to recommend destroying history. The two obvious candidates (`Estimate Follow-Up`, `Auto Missed Call Text-Back`) are already Drafts, so they cost you nothing sitting there, and Draft is reversible where deletion is not.

---

## Flagged — looks dead, may not be

- **`Speed to Lead`** — the important one. Zero enrollments reads as dead. It is actually *waiting*. Deleting it would be reasonable-looking and wrong.
- **`Demo No-Show Recovery`** (0 enrolled) — you have had no no-shows yet. Absence of enrollments is the expected state, not evidence of decay.
- **`Review Engine`** — won't fire from this funnel because you have no completed jobs in this account. Still correct for the product you sell.

---

## Recommended sequence

1. **Rename everything** — zero risk, immediate clarity.
2. **Disable `Speed to Lead`** — removes the landmine before ads start.
3. **Decide on the two missed-call duplicates** — open both, keep the better one, mark the other `Legacy —`.
4. **Merge `Funnel Intake` + `Funnel Complete`** — one event should be one workflow with one notification, not two.
5. **Build the no-booking follow-up** — the actual revenue gap (spec below).
6. **Leave deletions until the account has run clean for a month.**

---

## Proposed: `Lead — No Booking Follow-up`

Prerequisite: add an **Add Tag `booked-demo`** action to `Demo Call`, so this workflow can tell who converted.

```
Trigger:  Contact Tag added — "funnel-done"
Wait      15 minutes
If/Else   Tags include "booked-demo"  ->  END
SMS 1
Wait      until 9:00 AM next day
If/Else   Tags include "booked-demo"  ->  END
SMS 2
Wait      2 days
If/Else   Tags include "booked-demo"  ->  END
SMS 3  ->  END
```

Copy — plain ASCII, no em dashes or curly quotes, all under 160 characters:

**SMS 1 (15 min)**
```
Hey {{contact.first_name}}, it's Ronnie from WorkTruck Systems. You filled out the form but didn't pick a time. Want me to just call you instead?
```

**SMS 2 (next morning)**
```
Hey {{contact.first_name}}, Ronnie again from WorkTruck Systems. Still want that 20 min look at the system? Reply YES and I'll text you some times.
```

**SMS 3 (day 3, final)**
```
{{contact.first_name}}, last one from me. If the timing is off just say so and I'll leave you alone. If not, reply YES and I'll send times.
```

All three ask for a reply rather than pushing a link — it suits "you get the owner, not a rep," and replies build carrier trust where link-heavy texts erode it.

**One decision:** your other workflows use an 11:00–20:00 window. Applying it here delays the 15-minute message, which is the one that matters most. Someone who submitted at 2am is awake and just engaged with you, so an immediate reply is defensible — but that is your call. I would put the window on messages 2 and 3 regardless.

---

## What I could not verify

Honest limits of this audit:

- Triggers for **Auto Missed Call Text-Back, Demo No-Show Recovery, Estimate Follow-Up, Missed Call Textback, Review Engine, Stop No-Show Sequence** — the workflow list kept re-rendering at a width that cut off the table, and opening each one was unreliable.
- Enrollment counts for **Funnel Intake, Missed Call Textback, Review Engine, Stop No-Show Sequence**.
- Whether `Auto Missed Call Text-Back` and `Missed Call Textback` are genuinely duplicates, or one supersedes the other.

None of these change the four headline findings or the recommended sequence. They would refine the DISABLE list. If you want them nailed down, the fastest path is you opening each of the six and pasting me the trigger line.
