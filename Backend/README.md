# Training Cave Backend API 🗿

Complete backend API for the Training Cave platform built with Node.js, Express, and PostgreSQL.

## 📋 Features

- ✅ User authentication (JWT)
- ✅ Role-based access control (Admin, Trainer, Learner)
- ✅ File upload to AWS S3 (up to 1GB)
- ✅ Training material management
- ✅ Trainer approval system
- ✅ Email notifications
- ✅ Download tracking
- ✅ Rating system
- ✅ Advanced search and filtering
- ✅ RESTful API design

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **File Storage:** AWS S3
- **Authentication:** JWT + bcrypt
- **Email:** Nodemailer
- **Validation:** express-validator

## 📦 Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher)
3. **AWS Account** (for S3 storage)
4. **Email Account** (Gmail recommended for SMTP)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create a PostgreSQL database:

```bash
createdb training_cave
```

Run the schema:

```bash
psql training_cave < ../database-schema.sql
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=training_cave
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your-bucket-name

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=jay.thanki@cognixia.com
```

### 4. Start Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "learner",  // or "trainer"
  "bio": "Optional bio",
  "expertise": "Optional expertise"
}
```

**Response:**
```json
{
  "message": "Registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "learner",
    "status": "active"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Materials Endpoints

#### Get All Materials
```http
GET /api/materials?category=soft-skills&search=communication&page=1&limit=12
```

**Query Parameters:**
- `category` - Filter by category slug
- `search` - Search in title/description
- `fileType` - Filter by file type
- `sortBy` - newest | oldest | popular | rating
- `page` - Page number
- `limit` - Items per page

#### Upload Material (Trainer only)
```http
POST /api/materials
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <file>,
  "title": "Training Title",
  "description": "Description",
  "categoryId": "uuid",
  "tags": "leadership,communication",
  "trainingDate": "2024-04-20",
  "trainingType": "delivered"
}
```

#### Download Material
```http
GET /api/materials/:id/download
Authorization: Bearer <token>
```

Returns signed S3 URL valid for 1 hour.

#### Get My Materials (Trainer only)
```http
GET /api/materials/my/materials
Authorization: Bearer <token>
```

#### Update Material (Trainer only)
```http
PUT /api/materials/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Material (Trainer/Admin only)
```http
DELETE /api/materials/:id
Authorization: Bearer <token>
```

### Admin Endpoints

All admin endpoints require `super_admin` role.

#### Get Pending Trainers
```http
GET /api/admin/trainers/pending
Authorization: Bearer <admin-token>
```

#### Approve Trainer
```http
POST /api/admin/trainers/:id/approve
Authorization: Bearer <admin-token>
```

Sends approval email to trainer and notification to admin.

#### Reject Trainer
```http
POST /api/admin/trainers/:id/reject
Authorization: Bearer <admin-token>
```

#### Get All Users
```http
GET /api/admin/users?role=trainer&status=active&search=john
Authorization: Bearer <admin-token>
```

#### Ban User
```http
POST /api/admin/users/:id/ban
Authorization: Bearer <admin-token>
```

#### Get Platform Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

Returns:
```json
{
  "stats": {
    "users": {
      "learners": 1158,
      "trainers": 87,
      "pending_trainers": 12,
      "total_users": 1245
    },
    "materials": 456,
    "downloads": 45678,
    "averageRating": "4.70",
    "thisWeek": {
      "new_users": 34,
      "new_materials": 23,
      "week_downloads": 1234
    }
  }
}
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- SQL injection protection (parameterized queries)
- File type validation
- File size limits (1GB)
- CORS configuration

## 📁 Project Structure

```
training-cave-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── materialsController.js # Materials CRUD
│   │   └── adminController.js     # Admin operations
│   ├── routes/
│   │   ├── auth.js                # Auth routes
│   │   ├── materials.js           # Materials routes
│   │   └── admin.js               # Admin routes
│   ├── middleware/
│   │   └── auth.js                # JWT verification
│   ├── utils/
│   │   ├── email.js               # Email sending
│   │   └── s3.js                  # AWS S3 operations
│   ├── config/
│   │   └── database.js            # PostgreSQL connection
│   └── server.js                  # Express app
├── .env.example                    # Environment template
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🔧 Configuration

### AWS S3 Setup

1. Create an S3 bucket in AWS Console
2. Create IAM user with S3 full access
3. Generate access keys
4. Add credentials to `.env`

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use app password in `.env` as `EMAIL_PASSWORD`

### Database

The database schema includes:
- **users** - All users (learners, trainers, admins)
- **categories** - 7 training categories
- **materials** - Training files metadata
- **downloads** - Download tracking
- **ratings** - Material ratings
- **bookmarks** - Saved materials
- **notifications** - Admin notifications
- **audit_log** - System activity log

## 🧪 Testing API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User","role":"learner"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get materials (with token)
curl -X GET http://localhost:5000/api/materials \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import collection from `/docs/postman-collection.json`
2. Set environment variables
3. Test all endpoints

## 📧 Email Notifications

Emails are sent for:
- Trainer registration (to admin: jay.thanki@cognixia.com)
- Trainer approval (to trainer)
- Trainer rejection (to trainer)
- New material upload (to admin)

## 🚨 Error Handling

All errors return JSON:

```json
{
  "error": "Error message here",
  "details": "Additional context (in development mode)"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `413` - File Too Large
- `500` - Server Error

## 📊 Database Backups

Backup database:
```bash
pg_dump training_cave > backup.sql
```

Restore from backup:
```bash
psql training_cave < backup.sql
```

## 🚀 Deployment

### Heroku

```bash
heroku create training-cave-api
heroku addons:create heroku-postgresql:standard-0
heroku config:set NODE_ENV=production
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_NAME` | Database name | `training_cave` |
| `JWT_SECRET` | JWT signing key | Random 32+ char string |
| `AWS_S3_BUCKET` | S3 bucket name | `training-cave-files` |
| `EMAIL_USER` | SMTP email | `your-email@gmail.com` |
| `ADMIN_EMAIL` | Admin notifications | `jay.thanki@cognixia.com` |
| `MAX_FILE_SIZE` | Upload limit (bytes) | `1073741824` (1GB) |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🐛 Troubleshooting

**Database connection fails:**
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check firewall/port 5432

**File upload fails:**
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure bucket exists in correct region

**Email not sending:**
- Use Gmail App Password, not regular password
- Enable "Less secure app access" (if not using 2FA)
- Check SMTP settings

## 📞 Support

Contact: jay.thanki@cognixia.com

---

**Built with 🦴 by Caveman**
