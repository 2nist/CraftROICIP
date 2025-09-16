# Craft CIP ROI Calculator

This repository contains a single-page Clean-In-Place (CIP) ROI calculator (`CRAFTROICIP.html`).

How to use locally

1. Open `CRAFTROICIP.html` in a browser, or serve the directory locally:

```powershell
Set-Location 'C:\Users\CraftAuto-Sales\Downloads\DEV\CRAFTROICIP'
python -m http.server 8000
Start-Process 'http://localhost:8000/CRAFTROICIP.html'
```

Deployment

- The repository includes a GitHub Actions workflow that publishes `index.html` and `CRAFTROICIP.html` to the `gh-pages` branch and serves the site via GitHub Pages.

License

MIT
