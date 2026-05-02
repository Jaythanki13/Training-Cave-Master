# 🗿 Training Cave

> **A modern, secure platform connecting trainers and learners through accessible, high-quality training materials**

[![Made with React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequests.com)

---

## 📖 Overview

**Training Cave** is a comprehensive training materials repository designed to bridge the gap between expert trainers and eager learners. Built with modern web technologies, it provides a centralized hub where trainers can share their expertise and learners can access quality educational content across multiple domains.

### 🎯 The Problem It Solves

In today's corporate training environment:
- Training materials are scattered across multiple platforms
- Learners struggle to find quality, verified content
- Trainers lack a unified platform to share their expertise
- Organizations need better visibility into training resources
- Content security and access control are often inadequate

**Training Cave solves these challenges** by providing a secure, user-friendly platform that centralizes training materials while maintaining strict access controls and quality standards.

---

## ✨ Key Features

### For Learners 📚
- **Comprehensive Library** - Browse 1000+ training materials across 7 categories
- **Advanced Search** - Find exactly what you need with powerful filters
- **Multiple Formats** - Access PDFs, presentations, videos, code files, and more
- **Progress Tracking** - Track downloads and bookmark favorites
- **Rating System** - Review materials and help others find the best content
- **Responsive Design** - Learn on any device - desktop, tablet, or mobile

### For Trainers 👨‍🏫
- **Easy Upload** - Drag-and-drop interface for materials up to 1GB
- **Rich Metadata** - Categorize with tags, descriptions, and training dates
- **Analytics Dashboard** - Track downloads, ratings, and engagement
- **Version Control** - Update materials and maintain training history
- **Profile Management** - Showcase expertise and build reputation
- **Content Ownership** - Maintain intellectual property rights

### For Administrators 👑
- **Trainer Approval System** - Verify trainers before granting upload access
- **User Management** - Monitor, approve, ban, or unban users
- **Platform Analytics** - Real-time statistics and insights
- **Content Moderation** - Review and remove inappropriate materials
- **Email Notifications** - Stay informed of all platform activities
- **Audit Logging** - Complete activity tracking for compliance

---

## 🏗️ Architecture

### Technology Stack

#### Frontend
```
React 18.2          - Modern, component-based UI
Tailwind CSS        - Utility-first styling
React Router        - Client-side routing
Lucide Icons        - Beautiful, consistent icons
Vite               - Lightning-fast build tool
```

#### Backend
```
Node.js 18+        - JavaScript runtime
Express.js         - Web application framework
PostgreSQL 14+     - Robust relational database
JWT                - Secure authentication
bcrypt             - Password encryption
Multer             - File upload handling
```

#### Cloud Services
```
AWS S3             - Scalable file storage
Nodemailer         - Email notifications
GitHub Codespaces  - Cloud development environment
```

### System Architecture

```
┌─────────────────┐
│   React App     │  ← User Interface
│  (Port 3000)    │
└────────┬────────┘
         │
         │ REST API
         │
┌────────▼────────┐
│  Express API    │  ← Business Logic
│  (Port 5000)    │
└────────┬────────┘
         │
    ┌────┴────┬────────┐
    │         │        │
┌───▼───┐ ┌──▼──┐ ┌──▼──┐
│ PostgreSQL│ AWS S3│ Email │
│ Database  │ Storage│ SMTP │
└──────────┘ └─────┘ └─────┘
```

---

## 🎓 Training Categories

The platform supports seven comprehensive training categories:

1. **Soft Skills**
   - Communication, Leadership, Team Building
   - Handouts, Workbooks, PPTs
   - Pre-read & Post-read materials
   - Gamification activities

2. **Technical Training**
   - Programming, Data Science, Cloud Computing
   - Pre-training materials, Code files, Datasets
   - Hands-on labs and exercises

3. **AI & Trending Technologies**
   - Machine Learning, Generative AI
   - DevOps, Cloud Native, Emerging Tech
   - Industry-relevant content

4. **Security Training**
   - Cybersecurity, InfoSec, Compliance
   - Ethical Hacking, Security Best Practices
   - Certification preparation

5. **Tool-Based Training**
   - Software Applications, Platforms
   - Step-by-step guides, Video tutorials
   - Practical demonstrations

6. **Official Certifications**
   - CSM, CSPO, Salesforce, Microsoft
   - AWS, Google Cloud, Azure
   - Exam preparation materials

7. **Healthcare Training**
   - Medical & Clinical training
   - Healthcare IT, Compliance
   - Patient care standards

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
PostgreSQL 14+
Git
```

### Quick Start (3 Methods)

#### Option 1: GitHub Codespaces (Recommended) ☁️

Perfect for locked/managed company laptops!

```bash
1. Fork this repository
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait for auto-setup (5 minutes)
4. Terminal 1: cd backend && npm run dev
5. Terminal 2: cd frontend && npm run dev
6. Open preview URLs
```

**No installation needed! Everything runs in browser!**

#### Option 2: Local Development 💻

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/training-cave.git
cd training-cave

# Setup database
createdb training_cave
psql training_cave < database-schema.sql

# Install backend
cd backend
cp .env.example .env  # Configure environment variables
npm install
npm run dev

# Install frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

#### Option 3: Docker 🐳

```bash
docker-compose up
```

Visit `http://localhost:3000` to see the application!

---

## 📸 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)
*Beautiful, modern landing page with clear call-to-action*

### Learner Dashboard
![Learner Dashboard](docs/screenshots/learner-dashboard.png)
*Browse, search, and filter thousands of training materials*

### Trainer Dashboard
![Trainer Dashboard](docs/screenshots/trainer-dashboard.png)
*Upload materials and track engagement analytics*

### Admin Panel
![Admin Panel](docs/screenshots/admin-panel.png)
*Comprehensive admin controls and platform statistics*

---

## 🔒 Security Features

- **JWT Authentication** - Secure, stateless authentication
- **Role-Based Access Control** - Three-tier permission system
- **Password Encryption** - bcrypt with salt rounds
- **SQL Injection Protection** - Parameterized queries
- **File Validation** - Type and size checking
- **Rate Limiting** - API abuse prevention
- **CORS Configuration** - Cross-origin security
- **Helmet.js** - HTTP header security
- **Private File Storage** - Signed URLs for downloads
- **Audit Logging** - Complete activity tracking

---

## 📊 Database Schema

### Core Tables

```sql
users              - User accounts (learners, trainers, admins)
categories         - Training categories
materials          - Training files and metadata
downloads          - Download tracking
ratings            - Material reviews and ratings
bookmarks          - Saved materials
notifications      - Admin notifications
audit_log          - System activity log
```

### Relationships

```
users (1) ──< (N) materials
materials (1) ──< (N) downloads
materials (1) ──< (N) ratings
users (1) ──< (N) bookmarks
categories (1) ──< (N) materials
```

---

## 🌐 API Documentation

### Authentication

```http
POST /api/auth/register     - Register new user
POST /api/auth/login        - User login
GET  /api/auth/profile      - Get current user
PUT  /api/auth/profile      - Update profile
PUT  /api/auth/change-password - Change password
```

### Materials

```http
GET    /api/materials              - Browse materials
POST   /api/materials              - Upload material (trainer)
GET    /api/materials/:id          - Get material details
GET    /api/materials/:id/download - Download material
PUT    /api/materials/:id          - Update material (trainer)
DELETE /api/materials/:id          - Delete material (trainer/admin)
GET    /api/materials/categories   - Get all categories
```

### Admin

```http
GET  /api/admin/trainers/pending      - Pending trainers
POST /api/admin/trainers/:id/approve  - Approve trainer
POST /api/admin/trainers/:id/reject   - Reject trainer
GET  /api/admin/users                 - All users
POST /api/admin/users/:id/ban         - Ban user
POST /api/admin/users/:id/unban       - Unban user
GET  /api/admin/stats                 - Platform statistics
GET  /api/admin/materials             - All materials
```

Full API documentation available in [docs/API.md](docs/API.md)

---

## 🎨 Design Philosophy

### User Experience
- **Intuitive Navigation** - Find what you need in seconds
- **Minimal Friction** - Sign up and start learning immediately
- **Responsive Design** - Seamless experience across all devices
- **Accessibility** - WCAG 2.1 compliant
- **Performance** - Optimized for speed and efficiency

### Visual Design
- **Dark Theme** - Reduce eye strain, modern aesthetic
- **Amber/Orange Accents** - Warm, inviting color palette
- **Consistent Typography** - Clear, readable text hierarchy
- **Smooth Animations** - Professional transitions and interactions
- **Grid/List Toggle** - User preference flexibility

---

## 📈 Use Cases

### Corporate Training Departments
- Centralize training materials for employees
- Track training completion and engagement
- Maintain compliance documentation
- Control access to sensitive materials

### Educational Institutions
- Share course materials with students
- Build a knowledge repository
- Enable peer-to-peer learning
- Track resource utilization

### Consulting Firms
- Organize client training materials
- Maintain training catalog
- Quality control over content
- Professional presentation

### Individual Trainers
- Build professional portfolio
- Reach wider audience
- Track material performance
- Establish expertise

---

## 🛠️ Development

### Project Structure

```
training-cave/
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation
│   │   ├── utils/           # Helpers (email, S3)
│   │   └── server.js        # Express app
│   ├── config/              # Configuration
│   └── package.json         # Backend dependencies
│
├── database-schema.sql      # PostgreSQL schema
└── .devcontainer/           # Codespaces config
```

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=training_cave
DB_USER=your_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com

# Limits
MAX_FILE_SIZE=1073741824  # 1GB
```

### Available Scripts

```bash
# Frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build

# Backend
npm run dev         # Start with nodemon
npm start           # Start production server
npm run db:setup    # Initialize database
```

---

## 🚢 Deployment

### Recommended Stack

- **Frontend:** Vercel (Free tier available)
- **Backend:** Railway ($5/month)
- **Database:** Railway PostgreSQL ($5/month)
- **Storage:** AWS S3 (~$1/month)
- **Total:** ~$11/month

### Deployment Guides

- [Deploy to Vercel](docs/deploy/VERCEL.md)
- [Deploy to Railway](docs/deploy/RAILWAY.md)
- [AWS S3 Setup](docs/deploy/AWS-S3.md)
- [Docker Deployment](docs/deploy/DOCKER.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### How to Contribute

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas We Need Help

- [ ] Additional language translations
- [ ] Mobile app development
- [ ] Integration with LMS platforms
- [ ] Advanced analytics features
- [ ] Video streaming capabilities
- [ ] API client libraries

---

## 📝 Roadmap

### Version 1.0 (Current)
- [x] User authentication
- [x] Material upload/download
- [x] Trainer approval system
- [x] Admin dashboard
- [x] Search and filters
- [x] Rating system

### Version 1.1 (Q2 2024)
- [ ] Live training sessions
- [ ] Video streaming
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Mobile responsive improvements

### Version 2.0 (Q3 2024)
- [ ] AI-powered recommendations
- [ ] Learning paths
- [ ] Skill assessments
- [ ] Integration APIs
- [ ] Advanced analytics
- [ ] Multi-language support

---

## 📊 Statistics

- **Materials:** 1,000+ training resources
- **Categories:** 7 comprehensive areas
- **File Types:** 15+ supported formats
- **Max Upload:** 1GB per file
- **Users:** Unlimited learners, verified trainers
- **Uptime:** 99.9% availability

---

## 🙏 Acknowledgments

- React team for amazing framework
- Node.js community for robust ecosystem
- PostgreSQL for reliable database
- Tailwind CSS for beautiful styling
- All contributors and testers

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Project Maintainer:** Jay Thanki  
**Email:** jay.thanki@cognixia.com  
**Organization:** Cognixia

---

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code
- 📢 Sharing with others

---

## 📚 Documentation

- [Full Documentation](docs/README.md)
- [API Reference](docs/API.md)
- [User Guide](docs/USER-GUIDE.md)
- [Admin Guide](docs/ADMIN-GUIDE.md)
- [Developer Guide](docs/DEVELOPER-GUIDE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

---

## 🔗 Links

- [Live Demo](https://training-cave-demo.vercel.app)
- [Documentation](https://docs.training-cave.dev)
- [API Playground](https://api.training-cave.dev)
- [Status Page](https://status.training-cave.dev)

---

<div align="center">

**Built with 🗿 for the learning community**

[Report Bug](https://github.com/YOUR_USERNAME/training-cave/issues) · 
[Request Feature](https://github.com/YOUR_USERNAME/training-cave/issues) · 
[Documentation](docs/README.md)

</div>
