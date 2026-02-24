# 🚀 Deploy to Render - Step by Step Guide

## Prerequisites
- [ ] GitHub account
- [ ] Render account (sign up at [render.com](https://render.com))
- [ ] MongoDB Atlas account (free tier)
- [ ] Cloudinary account (free tier)

---

## ⚙️ Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Create a new cluster (M0 Free tier)
4. Wait for cluster to deploy (~5 minutes)
5. Click **Connect** → **Connect your application**
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. **Important:** Replace `<password>` with your actual password
8. Add `/mlaf` at the end: `mongodb+srv://username:password@cluster.mongodb.net/mlaf?retryWrites=true&w=majority`
9. **Security:** Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (for Render)

---

## 📸 Step 2: Set Up Cloudinary (Image Storage)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your Dashboard
4. Copy these 3 values:
   - **Cloud Name** (e.g., `dtyizkp4z`)
   - **API Key** (e.g., `719771991117554`)
   - **API Secret** (click the eye icon to reveal)

---

## 🔐 Step 3: Generate JWT Secret

Run this command in your terminal to generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (it should be a long random string like `a3f8e9d2c1b4a5f6...`)

---

## 📤 Step 4: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
cd /Users/user/Desktop/MLAF

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - MLAF Backend ready for Render"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🎯 Step 5: Deploy to Render

### Option A: Deploy with Blueprint (Recommended - Easiest)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Blueprint**
3. Connect your GitHub account (if not already connected)
4. Select your repository
5. Render will detect `render.yaml` automatically
6. Click **Apply**
7. Go to **Step 6** to configure environment variables

### Option B: Manual Deployment

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub account
4. Select your repository
5. Configure the service:
   - **Name:** `mlaf-backend`
   - **Root Directory:** `Backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

---

## 🔑 Step 6: Configure Environment Variables

1. Go to your Render service dashboard
2. Click **Environment** in the left sidebar
3. Add these environment variables (click **Add Environment Variable** for each):

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `10000` | `10000` |
| `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/mlaf` |
| `JWT_SECRET` | The random string you generated | `a3f8e9d2c1b4a5f6e7d8c9b0a1...` |
| `ADMIN_USER` | Your admin username | `admin` |
| `ADMIN_PASS` | Your admin password | `SecurePassword123!` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard | `dtyizkp4z` |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard | `719771991117554` |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard | `AbC123XyZ789...` |

4. Click **Save Changes**
5. Render will automatically redeploy with the new environment variables

---

## ✅ Step 7: Verify Deployment

1. Wait for the build to complete (~3-5 minutes)
2. Once deployed, you'll see a green "Live" badge
3. Click on your service URL (e.g., `https://mlaf-backend.onrender.com`)
4. You should see: `{"ok":true,"message":"MLAF Backend"}`

### Test the API:

```bash
# Replace YOUR_RENDER_URL with your actual URL
curl https://mlaf-backend.onrender.com/

# Should return:
# {"ok":true,"message":"MLAF Backend"}
```

---

## 📱 Step 8: Connect Mobile App to Backend

1. Copy your Render URL (e.g., `https://mlaf-backend.onrender.com`)
2. Open `mobile-app/src/config.js`
3. Update the API URL:

```javascript
export const API_URL = 'https://mlaf-backend.onrender.com';
```

4. Save the file
5. Restart your Expo app or run `eas update` to push the changes

---

## 🔄 Step 9: Enable Auto-Deploy (Optional but Recommended)

Render automatically redeploys when you push to GitHub, but you can configure it:

1. Go to your service → **Settings**
2. Scroll to **Build & Deploy**
3. Ensure **Auto-Deploy** is set to **Yes**
4. Set branch to `main` (or your default branch)

Now, every time you push to GitHub, Render will automatically deploy the changes!

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Sleep Mode:** Free tier services sleep after 15 minutes of inactivity
- **Cold Start:** First request may take 30-60 seconds to wake up
- **Monthly Hours:** 750 hours/month (enough for 1 service running 24/7)

### Wake Up Your Service
To improve response time, you can:
1. Use a cron job service (like [cron-job.org](https://cron-job.org)) to ping your API every 14 minutes
2. Upgrade to a paid plan ($7/month) for always-on service

### Monitoring Your Service
- **Logs:** Go to service → **Logs** to see real-time logs
- **Metrics:** View CPU, memory, and request metrics in the dashboard
- **Events:** See deployment history and events

---

## 🐛 Troubleshooting

### Build Failed
- Check **Logs** in Render dashboard
- Verify `package.json` has all dependencies
- Ensure `"start": "node server.js"` is in `scripts`

### Environment Variable Errors
- Verify all required env vars are set
- Check for typos in variable names
- Ensure no extra spaces in values

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check MongoDB connection string format
- Ensure password doesn't contain special characters (or URL-encode them)

### Service Not Starting
- Check logs for errors
- Verify `PORT` is set to `10000`
- Ensure `server.js` uses `process.env.PORT`

---

## 🎉 Success!

Your backend is now live on Render! 🚀

**Your API URL:** `https://YOUR_SERVICE_NAME.onrender.com`

### Next Steps:
1. ✅ Test all endpoints (GET, POST, PATCH, DELETE)
2. ✅ Login to admin panel with your credentials
3. ✅ Upload a test item with image
4. ✅ Connect mobile app to the live backend
5. ✅ Share your app with users!

---

## 📚 Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Express.js Documentation](https://expressjs.com/)

---

**Need Help?** Check the logs first, then refer to the troubleshooting section above.
