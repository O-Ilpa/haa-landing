# HelpAfterAccident landing test

Static HTML, CSS, and JavaScript prototype with five audience routes:

- `index.html`
- `patients.html`
- `doctors.html`
- `lawyers.html`
- `investors.html`
- `ambassadors.html`

## Brand assets

Place the approved logo at `public/brand/logo.svg` and the approved icon at `public/brand/icon.svg`.
The current files are temporary placeholders and should not be treated as final brand assets.

## CTA URLs and forms

Edit `config.js`.

- `ctas.patient`
- `ctas.provider`
- `ctas.lawyer`
- `ctas.investor`
- `ctas.ambassador`
- `ctas.leadWebhook`

If an audience URL is blank, the CTA scrolls to that page's form. If `leadWebhook` is blank, forms show a development configuration error instead of pretending to submit.

## Claims and legal copy

Public proof points and the emergency notice live in `config.js`.
Claims are hidden unless their `approved` value is changed to `true`.

## Run locally

From this folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Remaining review TODOs

- Replace placeholder logo and icon with approved assets.
- Add reviewed Privacy and Terms content.
- Confirm public claims before enabling them.
- Connect a production `leadWebhook`.
