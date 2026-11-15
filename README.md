# KPM Technologies - one complete website

**Upload index.html. Everything needed by the website is inside that file.**

All 18 original and upgraded features are integrated into this one page. The black, blue and red design, Three.js scenes, SVG images, simulator, quote/PDF tools, onboarding, assistant, portal, comparison, lab and English/Afrikaans support are included. There are no required external script, image, font or CSS files, npm installs, API keys or build steps for this upload copy.

## Add it to GitHub

1. Unzip this download. Do not upload the ZIP itself as your website.
2. Open your GitHub repository (or create one).
3. Choose **Add file -> Upload files**. Upload **index.html** to the top level of the repository, then commit it. You may also upload the included .nojekyll, README.md and license text.
4. Open **Settings -> Pages**. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then **Save**. If your repository uses a different branch, choose the branch containing this index.html.
6. When GitHub finishes deploying, use the **Visit site** link in Pages settings.

If this repository already uses an old GitHub Actions website workflow, switch Pages to **Deploy from a branch** for this upload copy. The website entry file must be at the selected publishing folder's top level, not inside a nested github-ready folder.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Preview

Double-click index.html to open the complete page locally in a modern browser. GitHub Pages serves the same file over HTTPS. External website health checks can still be blocked by the target website's CORS rules; current-page and HTML-file checks remain available.

## Existing demonstration boundaries

- The virtual headquarters and portfolio entries are clearly labeled concepts.
- The client portal and assistant remain browser-only demonstrations.
- Consultations prepare an unconfirmed request and calendar hold. No live booking calendar is connected.
- No verified reviews are invented. The review dataset starts empty; feedback prepares an email draft.
- Prices and PDFs are indicative planning estimates, not invoices or binding offers.
- Email and WhatsApp open drafts for the visitor to review and send. No messages are sent automatically.

## Validation

The standalone browser suite checks this exact export through a GitHub-style URL and by opening the local file directly. It covers all 18 features, real WebGL, PDF/brief/calendar downloads, English/Afrikaans and five responsive widths, with no extra asset-file requests.

## Editing later

Keep the original editable project as your source. Rebuild this file after changes with **npm run build:single**, or **node scripts/build-single-file.cjs**, and upload the newly generated index.html. The source files and earlier ZIPs have been preserved. Genuine approved review entries come from data/reviews.json when the single file is rebuilt.

Three.js, PDF-LIB, Fontkit and Noto font license notices are preserved both inside index.html and in THIRD-PARTY-LICENSES.txt. This upload has not been published or pushed to a GitHub account by the build.
