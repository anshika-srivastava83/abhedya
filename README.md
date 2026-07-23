# abhedya
A secure file vault with encrypted storage, breach-checked passwords, and access control - built as a hands-on cybersecurity learning project.

*Abhedya (अभेद्य) — Hindi for "impenetrable."*

A secure file vault web app — built as a hands-on learning project to understand how real encryption, authentication, and secure storage actually work under the hood, not just how to use them as black boxes.

## What This Project Is

Most apps store your uploaded files in a way where, if the server is ever compromised, everything becomes instantly readable — like locking your stuff in a storage room with your name on the box, but no actual lock on the door. Abhedya is different: files are **encrypted** before they're ever saved, using a real encryption key, so even the person running the server can't read them without it.

It's a **web app** — it runs in the browser, but unlike a static website, it actually does things: creates accounts, stores real data, remembers who's logged in, and enforces who can access what.

Two core security concepts run through the whole project, and they are deliberately kept distinct:
- **Hashing** (used for passwords) — one-way scrambling. Cannot be reversed. Used to verify a password is correct without ever storing the real thing.
- **Encryption** (used for files) — two-way scrambling using a **key**. The same key that locks data can unlock it again. This project uses **AES encryption**, the real industry-standard method used by banks and secure messaging apps.

## Project Roadmap

- Phase 1: Basic Login System
- Phase 2: Password Safety (Hashing + Breach Check)
- Phase 3: Plain File Upload
- Phase 4: File Encryption
- Phase 5: Access Control
- Phase 6: Polish + Hosting


## Tools Used (so far)

- Node.js — runs JavaScript on a server, not just in the browser
- Express — simplifies building the server
- SQLite — a real database that lives in a single file, no complex setup required
- VS Code — code editor
- Git & GitHub — version control and hosting

## Notes

This project is built by someone with no prior coding background, learning concepts just-in-time as each phase is built — so the codebase and this README will both grow more detailed over time rather than being planned out perfectly from day one.
