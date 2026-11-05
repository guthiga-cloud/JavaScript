# Node.js Contact Form (Custom Web3Forms Alternative)
Design By Benedict Guthiga 

A modern, fully functional dark-mode contact form. This project includes a custom Node.js backend that receives form submissions and sends them directly to your email inbox using Nodemailer.

## Features
* **Modern UI:** Dark-mode design with a glowing gradient button and smooth input focus states.
* **No Page Reloads:** Uses JavaScript `fetch()` to submit data asynchronously (AJAX).
* **Custom Backend:** Built with Express.js to handle form submissions.
* **Email Delivery:** Uses Nodemailer to securely send emails via Gmail.
* **Secure:** Uses `dotenv` to hide sensitive email credentials.

## Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Email:** Nodemailer

## Project Structure
```text
├── .env                # (Not pushed to GitHub) Secret email credentials
├── .gitignore          # Prevents node_modules and .env from being pushed
├── index.html          # The frontend form UI
├── style.css           # The dark-mode styling
├── script.js           # Handles form submission and API calls
├── server.js           # The Express backend and email logic
└── package.json        # Project dependencies