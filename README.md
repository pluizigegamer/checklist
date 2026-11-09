# Setup Checklist

A small, static setup checklist for Windows 11. It uses plain HTML, CSS, and JavaScript; there is no build step, backend, account, or external data service. Checkmarks are stored locally in each visitor's browser and are not included in shared links.

## Publish with GitHub Pages

1. Sign in to GitHub and create a repository. For a public page, make the repository public unless your GitHub plan supports Pages from a private repository.
2. Select **Add file > Upload files** in the repository. Upload `index.html`, `styles.css`, `script.js`, and `README.md` to the repository's top level, then commit the files.
3. Open the repository's **Settings**, then **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**. Select the `main` branch and `/(root)` folder, then select **Save**.
5. Wait for the Pages deployment to finish. GitHub displays the published link in **Settings > Pages**. The first deployment can take a few minutes.

## Find and share the website URL

For a project repository, the address is usually `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. Replace those two parts with your GitHub username and repository name. The exact published URL is also shown in **Settings > Pages**. Open it to check the page, then use **Copy checklist link** to copy the address to send to your friend.

The link shares the checklist page, not its checkmarks. Progress belongs to the individual browser and device where it was recorded. It is not synchronized, and a website cannot automatically detect whether an app is installed.

## Add or edit a program

Open `script.js` and find the `programs` array near the top. Each object describes one card:

```js
{
  id: 'firefox',
  name: 'Mozilla Firefox',
  icon: 'F',
  description: 'A web browser for visiting websites.',
  downloadUrl: 'https://www.mozilla.org/en-US/firefox/new/',
  steps: [
    'Open the official download page and download the Windows installer.',
    'Open the installer and follow its prompts.',
    'Sign in or create an account if the app asks you to.',
    'Open the app and check that its home screen appears.'
  ],
  problems: [
    '<strong>Installer does not open:</strong> Confirm you downloaded it from the official website.',
    '<strong>Sign-in trouble:</strong> Use the app’s official account recovery help.'
  ]
}
```

Copy the object into the array, separating entries with commas. Give each program a unique, simple `id` made of lowercase letters, numbers, and hyphens. Use the vendor's official HTTPS download page for `downloadUrl` and any links in the tutorial. Never advise visitors to bypass a security warning or turn off antivirus. The page labels all tutorials as Windows 11. Edit the existing `steps` and `problems` arrays to change tutorial wording. Save the file and upload the changed `script.js` to the repository to publish the update.

Progress is saved in browser `localStorage` where available. If browser storage is blocked or unavailable, the checklist still works for the open page, but checkmarks may not survive a refresh.
