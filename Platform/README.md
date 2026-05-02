# Training Cave Platform 🗿

A comprehensive platform for trainers to upload materials and learners to access quality training content.

## 📋 Prerequisites

Before you begin, make sure you have these installed on your computer:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Check installation: Open terminal/command prompt and type `node --version`

2. **npm** (comes with Node.js)
   - Check installation: `npm --version`

## 🚀 Quick Start Guide

### Step 1: Extract the ZIP file

Extract `training-cave-platform.zip` to a folder on your computer.

### Step 2: Open Terminal/Command Prompt

- **Windows**: Right-click in the folder and select "Open in Terminal" or "Command Prompt"
- **Mac**: Right-click and select "New Terminal at Folder"
- **Linux**: Right-click and select "Open Terminal Here"

### Step 3: Install Dependencies

In the terminal, run:

```bash
npm install
```

This will download all required packages. **It may take 2-5 minutes**. Don't close the terminal!

### Step 4: Start the Development Server

After installation completes, run:

```bash
npm run dev
```

The platform will automatically open in your browser at `http://localhost:3000`

## 🎯 What's Included

### Pages

1. **Landing Page** (`/`)
   - Sign up / Login
   - Platform overview
   - Features showcase

2. **Learner Dashboard** (`/learner`)
   - Browse training materials
   - Search and filter
   - Download materials
   - Grid/List view toggle

3. **Trainer Dashboard** (`/trainer`)
   - Upload training materials
   - Manage your uploads
   - Track downloads and ratings
   - View analytics

4. **Admin Panel** (`/admin`)
   - Approve/reject trainers
   - Monitor all users
   - Manage materials
   - View platform analytics

### Categories

The platform supports these training categories:

1. **Soft Skills**
   - Handouts, Workbooks, PPTs
   - Pre-read & Post-read materials
   - Gamification activities

2. **Technical Training**
   - Pre-training materials
   - Handouts/PPTs
   - Code files & Datasets
   - Post-training materials

3. **AI & Trending Technologies**
   - Machine Learning
   - Generative AI
   - Cloud, DevOps, etc.

4. **Security Training**
   - Cybersecurity
   - InfoSec & Compliance
   - Ethical Hacking

5. **Tool-Based Training**
   - Software tools
   - Platforms
   - Applications

6. **Official Certifications**
   - CSM, CSPO
   - Salesforce
   - Microsoft, AWS, Google Cloud
   - And more...

7. **Healthcare Training**
   - Medical & Clinical
   - Healthcare IT
   - Compliance

### File Upload Limits

- **Maximum file size**: 1GB (1024MB)
- **Supported formats**: PDF, DOCX, PPTX, XLSX, MP4, MP3, ZIP, JSON, CSV, SQL, PY, JS, JAVA

## 🛠️ Available Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
training-cave-platform/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx       # Home page with signup/login
│   │   ├── LearnerDashboard.jsx  # Learner browse interface
│   │   ├── TrainerDashboard.jsx  # Trainer upload interface
│   │   └── AdminPanel.jsx        # Admin management panel
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML entry point
├── package.json                   # Project dependencies
├── vite.config.js                 # Vite configuration
└── tailwind.config.js             # Tailwind CSS configuration
```

## 🔧 Troubleshooting

### Port 3000 already in use?

If you see "Port 3000 is already in use", either:
1. Close the other application using port 3000
2. Or edit `vite.config.js` and change `port: 3000` to `port: 3001`

### npm install fails?

1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm install` again

### Styles not loading?

Make sure you ran `npm install` completely before starting the dev server.

## 📧 Contact

For issues or questions:
- Email: jay.thanki@cognixia.com

## 🔜 Next Steps (Backend Development)

This is the **frontend** of the platform. To make it fully functional, you need:

1. **Database** (PostgreSQL/MongoDB)
2. **Backend API** (Node.js/Express)
3. **File Storage** (AWS S3 or Cloudflare R2)
4. **Authentication** (JWT tokens)
5. **Email Service** (for notifications)

The backend development is the next phase of this project.

## 🎨 Design Features

- Dark theme with amber/orange accents
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional UI components
- Accessible and user-friendly

---

**Built for Learning & Development Excellence** 🚀
