# IPX - Intelligent Participant Hub

**Tagline:** Your complete event companion – register, plan, connect, and engage effortlessly.

---

## Project Description

IPX is a **mobile-first application** designed to enhance the participant and event coordinator experience. The app allows participants to register as Students or Professionals, build personalized agendas, network with other participants, and check in seamlessly via QR code. Event coordinators can create events, manage sessions, and track attendee check-ins.  

For demonstration purposes, the app uses **browser storage (localStorage/IndexedDB)** as the database, making it **fully functional without external paid APIs**. Optional LinkedIn login can be used to pre-fill professional registration. Additional features include **participant matching** and **gamified points** to enhance engagement.

---

## Features

### Participant Flow
- Register as **Student** or **Professional**
- Optional **LinkedIn login** to auto-fill registration
- Browse event sessions
- Build **personalized agenda**
- QR code for check-in
- Participant matching for networking
- Gamified points and badges for engagement

### Event Coordinator Flow
- Create and manage events
- Add sessions, tracks, and speakers
- Dashboard to view attendees and check-in status
- QR code generation for check-in

### Technical Highlights
- **Mobile-first responsive UI/UX**
- Uses **browser storage** for data persistence across tabs
- Minimal API usage for **high feasibility and scalability**
- Fully demo-ready for hackathons

---

## Tech Stack
- Frontend: Vite + React (or chosen Lovable stack)
- Backend: Browser storage (localStorage / IndexedDB) for demonstration
- Optional: LinkedIn OpenID Connect for professional registration pre-fill

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/Pythonpreran/IPX-intelligent-participant-hub.git
cd IPX-intelligent-participant-hub

```

2.**Install dependencies**
```bash
npm install
```


3.**Start the development server**
```bash
npm run dev
```

4.**Open in mobile view**

Use a browser with mobile emulator or directly on mobile if supported.

--
Notes

All data is stored in browser storage for the demo.

No paid APIs are required to run the app.
