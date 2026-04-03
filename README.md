# NoteZ

Welcome to **NoteZ**, a modern, community-driven study notes platform designed to revolutionize the way students interact with academic materials! NoteZ empowers learners to seamlessly upload, share, discover, and actively engage with study notes.

Integrating a beautiful Next.js frontend with robust Supabase infrastructure, NoteZ goes beyond simple file hosting with features like a Next-gen interactive PDF viewer and an embedded Gemini-based AI Study Assistant.

## 🌟 Features

- **Global Note Repository:** Discover and filter study materials across various subjects and topics shared by the community.
- **Custom Interactive PDF Viewer:** Built from scratch to support zooming, brush annotations, erasing, and real-time document interaction.
- **Gemini AI Study Assistant:** Highlight text in any PDF document or simply type questions into the AI sidebar workspace to explain concepts contextually.
- **Save & Track Progress:** Keep track of your studies cleanly with dedicated **Bookmarks** and **Recently Viewed** dashboard sections.
- **Beautiful & Fully Responsive UI:** Carefully handcrafted adopting Radix UI primitives and Tailwind CSS with fluid animations via Framer Motion. 
- **Dark Mode Support:** Clean, strain-reducing night-owl capabilities out of the box using `next-themes`.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [Next.js (React 19)](https://nextjs.org/) + Turbopack
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Authentication & Row Level Security, Storage Buckets)
- **AI Integration:** Google Gemini API (`@google/generative-ai` proxying)
- **PDF Rendering Engine:** `pdfjs-dist` & `react-pdf`

---

## 🚀 Installation & Setup

Follow these steps to get NoteZ running locally on your machine.

### 1. Requirements

- Node.js version >= 20.x or higher
- `npm` or `pnpm` (pnpm strictly recommended)
- A registered account and project on [Supabase.com](https://supabase.com)
- An API Key for [Google Gemini AI Studio](https://aistudio.google.com/)

### 2. General Local Installation

1. Clone this repository down to your local system.
2. Under the root folder, install packages:
   ```bash
   pnpm install
   ```

### 3. Environment Variables Configuration

Create a `.env.local` file at the root of the project with the following required secrets.
```env
# SUPABASE SECRETS
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# GOOGLE AI (AI STUDY ASSISTANT) SECRETS
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
```

### 4. Database Setup (Supabase)

To properly execute application data requests (saving profiles, notes, annotations, tracking visits), you'll need the strict database schema.

We've provided a fully documented and formatted file `sqlQueries.sql` in the root folder containing line-by-line comments for tables and Row Level Security rules. 
Copy the contents of `sqlQueries.sql` and run them directly in your **Supabase Project's SQL Editor**.

The script will automatically configure:
- **`profiles`** table + Authentication Sign-up Trigger 
- **`notes`** table 
- **`bookmarks`** & **`recently_viewed`** tracking tables
- **`user_annotations`** & **`ai_chat_history`** functional stores
- A public Storage Bucket named **`note_bucket`**

### 5. Running the Developer Server

Once everything is installed and your `.env.local` file is populated:

```bash
pnpm run dev
```

The application should start up at `http://localhost:3000`.

---

## 🧠 Workflows Explained

How do the different pieces interact inside NoteZ? Here is a high-level technical breakdown of the architecture:

1. **Authentication Flow:** 
   - Uses Supabase Auth (`@supabase/supabase-js`) to manage sessions. 
   - Upon registration, an automatic Postgres Trigger (`handle_new_user`) intercepts the creation and instantly propagates a mirrored record in the `public.profiles` table storing meta-data (Name, DOB etc.). No manual insert required from frontend.

2. **Note Storage Structure:** 
   - When users upload a Note PDF, it is primarily passed to the Supabase Storage Bucket `note_bucket`. 
   - A public link resolves once the upload succeeds. That link URL, alongside topic/subject metadata, is inserted into the `public.notes` table under the user's `user_id`.

3. **PDF Fetching & Annotating & AI:** 
   - Clicking a note opens the custom generic `/studysession` route. It handles the `react-pdf` document parsing context. 
   - Users can draw on the canvas overlay element, generating a list of `SVG path actions`. Saving this dispatches an `upsert` of a JSONB array object back to the `user_annotations` database table linked firmly by `(user_id, note_id)` ensuring strict 1-to-1 save files. 
   - The same interface offers an `AiWorkspaceChat`, retrieving text-content and context prompting via an external REST call to Google's Gemini Flash endpoint. 

4. **Activity Metrics Tracker:**
   - Instead of risky standard client-side `update` authorizations that compromise RLS, views are tracked by executing a securely-defined SQL RPC Function `increment_view_count`.
   - Any opened note additionally pushes a log to `recently_viewed` forming a composite association of the Time, Note, and UID acting as an efficient dashboard-history layer.
