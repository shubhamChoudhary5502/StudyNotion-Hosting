# StudyNotion - Your Learning Companion 📚

Hey there! Welcome to StudyNotion, a cool project I've been working on to make learning fun and accessible. This README is like our tour guide, so let's dive in and see what's under the hood!

---

## 🚀 New Feature: ML-Powered Course Recommendation System 🤖

We've supercharged StudyNotion with **Machine Learning capabilities**!  
Now, learners get **personalized course recommendations** based on their interests and activities. This system intelligently analyzes course metadata, categories, and user preferences to help learners discover the most relevant and useful courses.

🔍 **How it Works:**
- Uses Natural Language Processing (NLP) to understand course topics.
- Computes content similarity using vector-based models (TF-IDF + cosine similarity).
- Dynamically recommends top N relevant courses when viewing any course page.

📦 **Tech Used:**
- Python (scikit-learn, pandas)
- Flask API for recommendation backend
- Integrated seamlessly with React frontend via REST API calls
- Deployed on backend and called via `<RecommendedCourses courseId={courseId} />` in the course detail view.

---

## Quick Intro 🌟

StudyNotion is my way of making learning interactive and exciting. It's not just for students but also for awesome instructors to share their knowledge with learners around the world. With features like flawless responsiveness across all screen sizes, a meticulously documented backend, progress tracking, secure payments, and now ML-driven recommendations — StudyNotion is here to elevate your learning experience!

---

## What's Inside? 🤔

This README will walk you through everything - from how the system works to setting it up on your machine. So, let's get started!

---

## Front-end Magic ✨

Built with ReactJS, TailwindCSS, and Redux for state management. The UI is sleek, responsive, and optimized for all devices.

### Pages You'll See 📚

**For Students:**
- Homepage
- Catalog
- Course List
- Course Details (with ML Recommendations!)
- Cart & Checkout
- Course Content Viewer
- Profile & Settings

**For Instructors:**
- Dashboard
- Create / Edit Courses
- Profile Management

---

## Back-end Power 💪

Node.js + Express.js-based server managing:
- Authentication (JWT + Google OAuth)
- Course & user data (MongoDB)
- Payments (Razorpay)
- Media (Cloudinary)
- Emails (Nodemailer)
- Recommendations (integrated with ML service)

---

## 🧑‍🤖 ML Recommendation Engine

- Separate Python Flask API deployed in the backend
- Calculates course similarities based on title, tags, and descriptions
- Exposes `/recommend/:courseId` route
- Called from React via Axios in `CourseDetails.jsx`

Example usage:
```jsx
<RecommendedCourses courseId={courseId} />
```

---

## Database World 📊

MongoDB is used to persist user info, course content, orders, reviews, and more.

---

## API Chat 🗣️

StudyNotion uses RESTful APIs to connect the front and back ends.  
📑 [Check full API docs here](https://documenter.getpostman.com/view/30301498/2s9YkrcfpL#ed95e6e0-58cb-4e0b-a3dd-d00f6dcc0110)

---

## Setup Guide 🔧

### 1. Clone & Install

```bash
git clone https://github.com/username/repo.git
cd StudyNotion
npm install
```

### 2. Environment Variables

Create a `.env` file in the root with:

```env
PORT=4000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

---

### 3. Start the Project

```bash
# Start backend
npm start

# Open a new terminal
cd client
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

