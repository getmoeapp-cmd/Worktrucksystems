# worktrucksystems.com — Surgery Instructions
**Two phases. Phase 1 today (5 min at any keyboard). Phase 2 tonight (after the Loom).**
All edits happen in `index.html` in your GitHub repo. Push = Vercel auto-deploys in ~1 min.

---

## PHASE 1 — TODAY

### Edit 1 — Kill both mailto buttons (the big one)

The string below appears **twice** in index.html (hero button + pricing button).
Find-and-replace ALL instances:

**FIND:**
```
mailto:support@worktrucksystems.com?subject=Demo%20request
```

**REPLACE WITH:**
```
https://api.leadconnectorhq.com/widget/bookings/demo-xoqfmqyc2
```

Optional but recommended — the button label (also appears twice):

**FIND:** `Book a demo`
**REPLACE WITH:** `Book a 15-min demo`

### Edit 2 — Put the free-website offer on the page

**FIND this line** (it's in the $297 pricing section):
```
One saved job covers the month — the rest is yours.
```

**PASTE THIS DIRECTLY AFTER that line's closing tag** (after the `</p>` it sits in):
```html
<p style="margin-top:0.75rem;font-weight:700;color:#F26A00;">
  Includes a free website that answers, quotes, and books — like the one you're reading right now.
</p>
```

### Push it

```bash
git add index.html
git commit -m "Booking link replaces mailto, free website offer added"
git push
```

Open worktrucksystems.com in a private tab after a minute — both buttons should open your calendar.

---

## PHASE 2 — TONIGHT (after the Loom is recorded)

### Edit 3 — The proof section

1. Get your Loom link, e.g. `https://www.loom.com/share/abc123def456` — the part after `/share/` is your **LOOM_ID**.
2. In index.html, **FIND:**
```
One system, four trades
```
3. Scroll UP from that line to the nearest line that begins with `<section` — paste this entire block on the line ABOVE it:

```html
<!-- ===== DEMO VIDEO ===== -->
<section id="demo" style="background:#1E1E1E;color:#fff;padding:4rem 1.25rem;">
  <div style="max-width:860px;margin:0 auto;text-align:center;">
    <p style="color:#F26A00;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:0 0 .5rem;">
      2:37 AM. I was asleep.
    </p>
    <h2 style="margin:0 0 1rem;">Watch the system catch a real missed call</h2>
    <p style="margin:0 auto 2rem;max-width:560px;opacity:.85;">
      Not a mockup — my actual logs. Somebody called, I didn't answer, the system texted them back in one second.
    </p>
    <div style="position:relative;padding-bottom:56.25%;height:0;border-radius:8px;overflow:hidden;">
      <iframe src="https://www.loom.com/embed/LOOM_ID"
        frameborder="0" allowfullscreen
        style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
    </div>
    <a href="https://api.leadconnectorhq.com/widget/bookings/demo-xoqfmqyc2"
       style="display:inline-block;margin-top:2rem;background:#F26A00;color:#1E1E1E;font-weight:700;padding:.9rem 2rem;border-radius:6px;text-decoration:none;">
      Book a 15-min demo
    </a>
    <p style="margin-top:1rem;opacity:.85;">
      Or just text me: <a href="sms:+13473421911" style="color:#F26A00;">(347) 342-1911</a>
    </p>
  </div>
</section>
```

4. Replace `LOOM_ID` in the iframe src with your real Loom ID.

### Push it

```bash
git add index.html
git commit -m "Demo video section live"
git push
```

---

## Sanity checklist after each push
- Both buttons open the booking calendar (not email)
- Free-website line shows in orange under the $297
- (Tonight) video plays on desktop AND phone
- Text link still opens Messages on mobile
