# M2PV Capital - Sanity CMS Setup

## Quick Start

### 1. Create a Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage) and sign in (or create an account)
2. Click **"Create new project"**
3. Name it: `M2PV Capital`
4. Choose **"Create empty project"**
5. Copy the **Project ID** shown (looks like: `abc123xyz`)

### 2. Configure Environment Variables

Open `.env.local` and replace the placeholder:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Add CORS Origin

1. In Sanity dashboard, go to your project → **API** → **CORS origins**
2. Add these origins:
   - `http://localhost:3000` (for local dev)
   - Your production URL (e.g., `https://m2pv.vercel.app`)

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the Studio

Go to: `http://localhost:3000/studio`

You'll see the Sanity Studio dashboard where you can:
- Edit **Site Settings** (hero text, stats, contact info)
- Add/edit **Team Members**
- Manage **Sectors**
- Create **Insights** articles

---

## Content Structure

### Site Settings (Single Document)
- Hero headline & subheadline
- Thesis section content & stats
- Ecosystem section text
- Rotating words for animation
- Opportunity zone content
- Contact info (email, phone, address)
- Footer tagline

### Team Members
- Name, title, bio
- Profile photo
- LinkedIn URL
- Display order

### Sectors
- Name, short & full descriptions
- Icon name (from Lucide)
- Statistics array
- Display order

### Insights
- Title, category, excerpt
- Date, read time
- Featured flag
- Display order

---

## Deployment

When you deploy to Vercel:

1. Add the same environment variables in Vercel project settings
2. Add your Vercel production URL to Sanity CORS origins
3. The studio will be accessible at `yoursite.com/studio`

---

## Next Steps

After setup, the site will:
1. **Fetch content from Sanity** on each page load
2. **Fall back to defaults** if Sanity is empty (so site never breaks)
3. **Allow Ralph to edit** any text via the studio dashboard
