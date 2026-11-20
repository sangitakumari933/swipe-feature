# Coy.

A full-stack, swipe-based profile discovery web application built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Interactive Card Stack:** Smooth, physics-inspired swipe gestures with real-time rotation, opacity, and LIKE/PASS feedback.
- **Responsive Controls:** Touch-and-drag swiping on mobile devices and dedicated Like/Pass action buttons on desktop.
- **MongoDB Integration:** Persistent profile storage with Mongoose and support for MongoDB Atlas or local instances.
- **Database Seeding:** Built-in seed script to populate sample profiles for quick local testing.

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Lucide React (Icons)

**Backend**
- Node.js (ES Modules)
- Express.js
- MongoDB & Mongoose
- dotenv


## Download & Installation

### 1. Download the Project

**Option A: Clone with Git**
```bash
git clone https://github.com/sangitakumari933/swipe-feature.git
cd swipe-coy-project
```

**Option B: Download ZIP**
1. Click the green **Code** button at the top of this GitHub repository.
2. Select **Download ZIP**.
3. Extract the downloaded ZIP file and open the folder in your code editor (e.g., VS Code).

---

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root directory:

```env
MONGO_URI = "mongodb+srv://kumarisangita8800_db_user:uKUryGOj3ugiigya@cluster0.3xqnuog.mongodb.net/"
port = 4000;

```
Start the backend server:

```bash
npm run server
```

*(Optional) If you need to seed the database manually:*

```bash
node users.js
```

---

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```
