# 🔐 Secrets App (Node.js + Express + MongoDB + JWT + EJS)

## 🚀 Live Demo

🔗 [Live Render Deployment](https://secrets-app-xjvi.onrender.com)

> Replace the above link with your actual Render URL.

---

## 📌 Project Overview

The **Secrets App** is a secure and user-friendly web application where users can register, log in, and anonymously submit personal secrets. The app emphasizes secure authentication, data privacy, and session management using **JSON Web Tokens (JWT)** and **MongoDB**. It features a clean and dynamic interface rendered with **EJS templates**.

---

## 🧑‍💻 Features

- 🔐 User Registration and Login with encrypted passwords
- ✅ Session and JWT-based authentication
- 🧾 Add personal secrets anonymously after logging in
- 🖼 View all secrets on the protected page
- ✏️ Edit and 🗑️ delete personal secrets
- ⚠️ Alerts and validations for empty input fields
- 👨‍💻 EJS-powered dynamic rendering
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

| Layer         | Technology            |
|---------------|------------------------|
| Frontend      | EJS (HTML + JS + CSS)  |
| Backend       | Node.js, Express.js    |
| Database      | MongoDB + Mongoose     |
| Authentication| JWT (JSON Web Tokens)  |
| Styling       | CSS                    |
| Deployment    | Render                 |

---

## 🔐 Security Highlights

- Passwords are **hashed** before saving using `bcrypt`
- Uses **JWT tokens** for authenticating user sessions
- Secrets are visible only to **authenticated users**
- Individual users can **edit and delete their own secrets only**

---

## 📂 Folder Structure

secrets-app/
├── views/
│ ├── login.ejs
│ ├── register.ejs
│ ├── submit.ejs
│ ├── secrets.ejs
│ └── edit.ejs
├── public/
│ └── css/
│ └── styles.css
├── index.js
├── .env
├── package.json
└── README.md
