# 📧 Outlook Email Saver Add-In

An Outlook plugin to **save composed emails and their attachments directly to OneDrive**. This add-in helps users back up important drafts or compose content for external sharing — all securely and with modern UI/UX.

---

## ✨ Features

- ✅ **Save Outlook emails to OneDrive as HTML**
- 📌 **Uploads attachments to OneDrive** and injects their download links into the saved email HTML
- 🔐 **Secure authentication via backend**
- 🫟 **Context-based state management**
- 💻 **Modern, responsive UI using Fluent UI for React**

---

## 📦 Technologies Used

| Technology                                                 | Description                                              |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| [Yo Office](https://github.com/OfficeDev/generator-office) | Project scaffolding for Office Add-ins                   |
| Outlook Add-in Manifest                                    | Declarative add-in setup                                 |
| React + Fluent UI                                          | Frontend framework with Microsoft’s modern design system |
| Microsoft Graph API                                        | To access OneDrive and upload content                    |
| Backend Authentication                                     | Secure auth handshake between client and backend         |
| Context API                                                | Global state management for authentication/session       |

---

## 🚀 Getting Started

### 1. Clone This Repo

```bash
git clone https://github.com/e19465/outlook-plugin-for-save-email
cd outlook-plugin-for-save-email
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Add-In

```bash
npm start
```

This will:

- Start a dev server
- Side-load the add-in to Outlook (usually opens in a browser)

> You must have [Office Add-in Debugger](https://learn.microsoft.com/office/dev/add-ins/testing/debug-add-ins-overview) and Outlook desktop or web access to test it.

---

## 🔐 Authentication

- Uses **MSAL (Microsoft Authentication Library)** to authenticate the user.
- Token is exchanged via a **custom NestJS backend** for security.
- Backend issues Graph API access tokens and handles sensitive logic.

👉 **Backend Repository**: [https://github.com/e19465/NestJs-Authentication-API](https://github.com/e19465/NestJs-Authentication-API)

---

## 📂 OneDrive Integration

- Emails are saved as `.html` files in a specified OneDrive folder.
- Attachments are uploaded separately, and their public shareable links are embedded in the email body.

---

## 🧚 Development Notes

- Uses `Context API` to manage user authentication state across components.
- Built with Microsoft’s **Fluent UI** to match Office ecosystem aesthetics.
- Tested on both **Outlook Web** and **Desktop** (Mac/Windows).

---

## 💡 Future Improvements

- Add support for email saving in `.pdf` format.
- Support multiple account linking (e.g., SharePoint, Dropbox).
- Email tagging & search functionality within OneDrive.

---

## 📄 License

MIT License — feel free to use, fork, and contribute.

---

## 👌 Contributing

PRs are welcome! If you want to suggest features or report bugs, feel free to open an issue or contact the maintainer.
