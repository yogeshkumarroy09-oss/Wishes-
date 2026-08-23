# Yogesh Birthday Wish Website

## Important
This project uses a Node.js/Express backend (`server.js`), so GitHub Pages alone cannot run the backend API.

For the complete wish + email functionality, deploy the project on a Node.js hosting service (for example Render or Railway) and connect the GitHub repository.

## Environment variables
Create these environment variables on the hosting service:

- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `RECIPIENT_EMAIL`

Do NOT commit the real `.env` file or private keys to GitHub.

## GitHub upload
Upload the project files to the repository root, including:
- `package.json`
- `server.js`
- `public/`
- `README.md`
- `.gitignore`
- `.env.example`

Then connect the repository to your Node.js hosting provider.

## Typical Node start command
`npm start`

If your package.json uses a different start script, use the command specified there.
