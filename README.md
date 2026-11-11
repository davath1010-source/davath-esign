# Davath eSign — Web starter (v1)

## Included
- Responsive English/Khmer landing page
- PDF upload (15 MB limit)
- Drawn or typed signature
- Adds signature to the last page and downloads a new PDF
- Free-only interface; no Premium plan

## Run locally
1. Unzip this folder.
2. Open a terminal in this folder.
3. Run `python3 -m http.server 8000`
4. Open `http://localhost:8000` in your browser.

You can also deploy these static files to a static hosting provider.

## Important limitations of this starter
- This is a front-end prototype, not a production e-signature service.
- It adds a visual signature to the last page only. It does not provide legally qualified digital signatures, identity verification, email invitations, multi-party signing, audit trails, accounts, or cloud storage.
- PDF processing happens in the browser. The PDF library is loaded from a public CDN, so internet access is needed.
- Do not use this prototype for confidential or legally critical documents until a secure backend and appropriate legal workflow are implemented.
