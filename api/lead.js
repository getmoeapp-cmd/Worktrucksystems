/**
 * POST /api/lead
 *
 * Receives funnel submissions from /start.html and upserts them into GHL.
 * Runs server-side, so no CORS and the token never touches the browser.
 *
 * Vercel → Settings → Environment Variables:
 *   GHL_TOKEN        the Private Integration token (starts with pit-)
 *   GHL_LOCATION_ID  ljnjsKRPJSiGC2ePan7L
 */

const GHL_API = 'https://services.leadconnectorhq.com/contacts/upsert';
const API_VERSION = '2021-07-28';

/* Payload key → GHL custom field key */
const CUSTOM_FIELDS = [
  'trade',
  'biggest_problem',
  'lead_system',
  'website_status',
  'demo_status',
  'funnel_stage',
  'systems_viewed',
  'systems_viewed_count'
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST only' });
  }

  const TOKEN = process.env.GHL_TOKEN;
  const LOCATION = process.env.GHL_LOCATION_ID;

  if (!TOKEN || !LOCATION) {
    console.error('Missing env vars', { hasToken: !!TOKEN, hasLocation: !!LOCATION });
    return res.status(500).json({ ok: false, error: 'Server not configured' });
  }

  /* Body may arrive parsed or as a raw string depending on content-type */
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); }
    catch { return res.status(400).json({ ok: false, error: 'Bad JSON' }); }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Empty body' });
  }

  /* Need at least one identifier to upsert against */
  if (!body.email && !body.phone) {
    return res.status(400).json({ ok: false, error: 'email or phone required' });
  }

  const customFields = CUSTOM_FIELDS
    .filter(k => body[k] !== undefined && body[k] !== '')
    .map(k => ({ key: k, field_value: String(body[k]) }));

  /* The tag IS the trigger. A distinct tag per stage means each post fires
     its own tag-added event in GHL — re-sending the same tag does nothing. */
  var tags = ['start-funnel'];
  if (body.funnel_stage === 'complete') tags.push('funnel-done');
  if (body.systems_viewed) tags.push('systems-browsed');

  const payload = {
    locationId: LOCATION,
    firstName: body.firstName || '',
    lastName:  body.lastName  || '',
    email:     body.email     || '',
    phone:     body.phone     || '',
    source:    body.source    || 'worktrucksystems.com/start.html',
    tags:      tags,
    customFields
  };

  /* UTMs land in attribution rather than custom fields */
  if (body.utm_source || body.utm_campaign || body.fbclid) {
    payload.attributionSource = {
      sessionSource: body.utm_source   || 'facebook',
      medium:        body.utm_medium   || 'paid',
      campaign:      body.utm_campaign || '',
      utmContent:    body.utm_content  || '',
      fbclid:        body.fbclid       || ''
    };
  }

  try {
    const ghl = await fetch(GHL_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Version': API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await ghl.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = text; }

    if (!ghl.ok) {
      /* Surfaced deliberately — if GHL rejects the shape, we need to see why */
      console.error('GHL rejected', ghl.status, parsed);
      return res.status(200).json({
        ok: false,
        ghlStatus: ghl.status,
        ghlResponse: parsed,
        sent: payload
      });
    }

    console.log('GHL ok', parsed?.contact?.id || '');
    return res.status(200).json({
      ok: true,
      contactId: parsed?.contact?.id || null,
      ghlResponse: parsed
    });

  } catch (err) {
    console.error('Request failed', err);
    return res.status(200).json({ ok: false, error: String(err) });
  }
}
