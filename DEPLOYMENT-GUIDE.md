# Website Deployment Guide
## How to Publish Your Concrete Canoe Website

Your website is **static HTML/CSS/JS**, which means it's easy to publish for free! Here are your best options:

---

## 🎓 **OPTION 1: NAU University Server** (RECOMMENDED for ABET)

Since you mentioned this is for a university capstone, NAU likely provides web hosting for students.

### Steps:
1. **Contact NAU IT Services** or your department
2. Ask about **student web hosting** or **SFTP access**
3. They'll provide:
   - Server address (e.g., `sce.nau.edu`)
   - Your username/password
   - Upload path (e.g., `/public_html/concrete-canoe/`)

4. **Upload your files** using an FTP client:
   - Download [FileZilla](https://filezilla-project.org/) (free)
   - Connect to NAU server
   - Upload entire `concrete-canoe` folder

5. **Your URL** will be something like:
   ```
   https://sce.nau.edu/capstone/projects/CENE/2026/ConcreteCanoe/
   ```

**Pros**: Official university domain, ABET-approved, permanent  
**Cons**: Requires NAU credentials

---

## 🚀 **OPTION 2: GitHub Pages** (FREE, 5 minutes)

Perfect for static sites. Free hosting with custom domain support.

### Steps:

1. **Create a GitHub account** (if you don't have one):
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Create a new repository**:
   - Click "New Repository"
   - Name it: `concrete-canoe-2026`
   - Make it **Public**
   - Click "Create repository"

3. **Upload your files**:
   ```bash
   cd /Users/user/.gemini/antigravity/scratch/concrete-canoe
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/concrete-canoe-2026.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to repository Settings
   - Click "Pages" in sidebar
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click "Save"

5. **Your website will be live at**:
   ```
   https://YOUR-USERNAME.github.io/concrete-canoe-2026/
   ```

**Pros**: Free, fast, version control, easy updates  
**Cons**: Public repository (anyone can see code)

---

## ⚡ **OPTION 3: Netlify** (FREE, Drag & Drop)

Easiest option - literally drag and drop your folder!

### Steps:

1. **Go to** [netlify.com](https://www.netlify.com/)
2. **Sign up** (free account)
3. **Drag your entire `concrete-canoe` folder** onto the Netlify dashboard
4. **Done!** Your site is live in 30 seconds

**Your URL**: `https://random-name-12345.netlify.app`  
(You can customize this to `concrete-canoe-nau.netlify.app`)

**Pros**: Instant deployment, automatic HTTPS, custom domains  
**Cons**: Random URL unless you pay for custom domain

---

## 🌐 **OPTION 4: Vercel** (FREE, Similar to Netlify)

Another excellent option for static sites.

### Steps:

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign up** with GitHub (or email)
3. **Import your GitHub repository** OR drag & drop folder
4. **Deploy** - takes 1 minute

**Your URL**: `https://concrete-canoe-2026.vercel.app`

**Pros**: Fast, free SSL, great performance  
**Cons**: Requires GitHub account for best experience

---

## 📋 **Quick Comparison**

| Option | Cost | Speed | Best For | URL Example |
|--------|------|-------|----------|-------------|
| **NAU Server** | Free | Medium | ABET Submission | `sce.nau.edu/...` |
| **GitHub Pages** | Free | Fast | Version Control | `username.github.io/...` |
| **Netlify** | Free | Instant | Quick Deploy | `site-name.netlify.app` |
| **Vercel** | Free | Instant | Modern Hosting | `site-name.vercel.app` |

---

## 🎯 **RECOMMENDED WORKFLOW**

For your ABET capstone, I recommend:

1. **Primary**: Deploy to **NAU Server** (official submission)
2. **Backup**: Deploy to **GitHub Pages** (portfolio, easy sharing)

This gives you:
- ✅ Official university URL for ABET
- ✅ Backup URL to share with recruiters
- ✅ Version control for your code

---

## 🔧 **Before You Deploy - CHECKLIST**

Make sure you've done these:

- [ ] Add the mobile CSS fixes from the ABET audit
- [ ] Test all links work (especially documents)
- [ ] Compress images (use [tinypng.com](https://tinypng.com))
- [ ] Update "Last Updated" date in footer
- [ ] Test on mobile (Chrome DevTools)
- [ ] Spell check all content
- [ ] Verify all PDFs are uploaded to `/documents/` folder

---

## 📞 **Need Help?**

**For NAU Server**:
- Email: `it-help@nau.edu`
- Phone: (928) 523-4357
- Ask about: "Student web hosting for capstone project"

**For GitHub/Netlify/Vercel**:
- All have excellent documentation
- Free support via their help centers

---

## 🚀 **FASTEST OPTION RIGHT NOW**

If you need a link **immediately** (like in the next 5 minutes):

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag your `concrete-canoe` folder
3. Get instant URL: `https://[random].netlify.app`

**That's it!** No account needed for the first deployment.

---

**Good luck with your capstone presentation!** 🎓
