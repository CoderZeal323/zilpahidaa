# Zilpah Idaa — Personal Site

**Technology stack:** 100% static + serverless — hosted on Cloudflare Pages, zero server required.

| Feature | Powered by |
|---|---|
| Blog CMS (write posts from browser) | Decap CMS (GitHub backend) |
| Likes & ratings per post | Supabase (free tier) |
| Email subscribers | Supabase (free tier) |
| Contact form submissions | Supabase (free tier) |
| Comments on posts | Giscus (GitHub Discussions) |

---

## 🚀 Deploy in 4 steps

### Step 1 — Push to GitHub
1. Create a new repo at https://github.com/new (set it to **public**)
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial deploy"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

### Step 2 — Deploy on Cloudflare Pages
1. Go to https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**
2. Connect your GitHub repo
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `.` (the root)
4. Click **Save and Deploy**

### Step 3 — Set Up Admin CMS Login (Decap CMS with GitHub)
The CMS uses GitHub as a backend — you log in with your GitHub account.

1. Open `admin/config.yml` and replace:
   ```yaml
   repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
   ```
   with your actual GitHub username and repo name (e.g. `zilpahidaa/my-site`)

2. Go to https://github.com/settings/applications → **New OAuth App**:
   - **Application name:** Zilpah Idaa CMS
   - **Homepage URL:** `https://your-site.pages.dev`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
   - Click **Register**, then copy the **Client ID** and **Client Secret**

3. Go to https://app.netlify.com → **Sites → Add new site → Deploy manually** (just to use their OAuth proxy — free, no deploy needed)
   - In that Netlify site: **Site Settings → Access control → OAuth → Install provider → GitHub**
   - Paste your Client ID and Client Secret

4. Visit `https://your-site.pages.dev/admin/` — click **Login with GitHub**

### Step 4 — Set Up Supabase (Likes, Ratings, Subscribers, Contact Form)
1. Go to https://supabase.com → **New Project** (free tier)
2. Note your **Project URL** and **anon public key** (Settings → API)
3. Open **SQL Editor** and run `supabase-schema.sql` — this creates all tables
4. Open `js/supabase-client.js` and update:
   ```js
   const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
   ```
   Also update the same two values in `js/main.js`
5. Commit and push — Cloudflare will redeploy automatically

**To view contact form submissions:** Supabase dashboard → Table Editor → `contact_submissions`
**To view subscribers:** Supabase dashboard → Table Editor → `subscribers`

---

## 📝 Add / Edit Blog Posts

1. Go to `https://your-site.pages.dev/admin/`
2. Log in with GitHub
3. Click **Blog Posts → New Blog Post**
4. Write in the markdown editor, upload a cover image, click **Publish**
5. Decap CMS opens a pull request on GitHub → merge it → Cloudflare rebuilds (takes ~30 seconds)

---

## 💬 Set Up Giscus Comments

1. Make sure your GitHub repo is **public** and has **Discussions enabled**
   - Repo Settings → Features → check "Discussions"
2. Go to https://giscus.app and enter your repo name
3. Choose: Category = **General**, Mapping = **Pathname**
4. Copy the `<script>` tag
5. Open `post/index.html`, find the `<!-- GISCUS COMMENTS SETUP -->` comment
6. Replace the placeholder `<div>` with your Giscus `<script>` tag

---

## 📚 Add Book Links

Open `index.html` and search for `selarLink` and `selfanyLink`:
```html
<a href="https://selar.co/YOUR-BOOK" ...>Buy on Selar</a>
<a href="https://selfany.com/YOUR-BOOK" ...>Buy on Selfany</a>
```

---

## 🔒 Environment Setup Summary

| Item | Where to configure |
|---|---|
| Photo | Already in `/images/uploads/` |
| CV / Resume | Already in `/images/uploads/` |
| Book links | Edit `index.html` |
| Supabase URL & key | Edit `js/supabase-client.js` and `js/main.js` |
| Giscus script | Edit `post/index.html` |
| CMS repo name | Edit `admin/config.yml` |
| GitHub OAuth | GitHub Settings → OAuth Apps |

---

*Built for Zilpah Idaa — SAP PM Consultant · Author · Coach — Hosted on Cloudflare Pages*
