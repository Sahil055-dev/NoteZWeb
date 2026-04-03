-- ==========================================
-- 1. PROFILES SETTING UP
-- ==========================================
-- Create the Table for User Profiles linked to Supabase Auth
create table if not exists public.profiles (
  "id" uuid not null references auth.users(id) on delete cascade, -- Links to auth.users ensuring deletion synchronicity
  "firstName" text, -- User's first name
  "lastName" text, -- User's last name
  "dateOfBirth" date, -- User's DOB
  "educationField" text, -- Field of study 
  "branch" text, -- Branch name
  "universityTier" text, -- University tier
  "subjectTags" text[], -- Array of subject interest strings
  primary key ("id") -- Primary key is the user ID
);

-- Enable Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

-- Policy: Users can independently update only their own profile
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = "id");

-- Policy: Users can view their own profile
create policy "Users can view own profile" on public.profiles 
for select using (auth.uid() = "id");

-- Policy: Allow public viewing of strictly specific basic columns (needed for Author name reading on Dashboard)
create policy "Public profiles name viewing" 
on public.profiles for select using (true);

-- Grant select on specific names safely
GRANT SELECT (id, "firstName", "lastName") ON TABLE public.profiles TO anon, authenticated;

-- Function: Trigger to handle creation of profile right after a user signs up via Supabase Auth
create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (
    "id", 
    "firstName", 
    "lastName", 
    "dateOfBirth"
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'firstName',
    new.raw_user_meta_data ->> 'lastName',
    (new.raw_user_meta_data ->> 'dateOfBirth')::date
  );
  return new;
end;
$$;

-- Trigger: Execute the handler above on each new auth user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user();

-- ==========================================
-- 2. NOTES SETTING UP
-- ==========================================
-- Create table for storing details about uploaded PDF notes
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key, -- Auto-generated unique ID for notes
  user_id uuid references public.profiles(id) on delete cascade default auth.uid(), -- The uploader's user ID linked to profiles
  title text not null, -- Note document title
  topic text, -- Associated note topic
  description text, -- Small note summary
  subject text, -- Subject category
  file_url text not null, -- Direct public link returning from Storage
  file_path text not null, -- Internal bucket path object representation (useful for delete execution)
  views_count int default 0, -- Tally for views/downloads, (Replaces old 'likes' implementation)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null -- Insert date
);

-- Enable Security mapping for notes
alter table public.notes enable row level security;

-- Policy: Any user (including anon) can see notes displayed everywhere
create policy "Public notes are viewable by everyone"
  on public.notes for select using ( true );

-- Policy: Authenticated users can only create their own notes
create policy "Users can insert their own notes"
  on public.notes for insert with check ( auth.uid() = user_id );

-- Policy: Allow deletion only by note owners
create policy "Users can delete own notes"
  on public.notes for delete using (auth.uid() = user_id);

-- Policy: Allow updating own notes fields natively
create policy "Users can update own notes"
  on public.notes for update using (auth.uid() = user_id);

-- ==========================================
-- 3. BOOKMARKS SETTING UP
-- ==========================================
-- Table storing saves/bookmarks linked between User and Note records
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- Bookmark entry ID
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- User who bookmarked
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE, -- Note that is bookmarked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- Time bookmarked
    UNIQUE(user_id, note_id) -- Only 1 bookmark per note+user constraint (prevents duplicating entries)
);

-- RLS implementations for Bookmarks 
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users may only view their own bookmark list
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

-- Policy: Insert allowed for logged user bookmarking notes functionality
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Delete allowed only for personal bookmarks reversing
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 4. RECENTLY VIEWED TRACKING SETTING UP
-- ==========================================
-- Table managing user history timeline of opened notes
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Viewer Session ID Target
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE, -- Viewed Document Target ID
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- Read time update target
    PRIMARY KEY (user_id, note_id) -- Composite key making Supabase.upsert functionality work correctly
);

ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own history" ON public.recently_viewed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users upsert own history" ON public.recently_viewed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own history" ON public.recently_viewed FOR UPDATE USING (auth.uid() = user_id);

-- Secure RPC function required bypassing standard limited update policies above solely for metrics
CREATE OR REPLACE FUNCTION public.increment_view_count(p_note_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notes
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = p_note_id;
END;
$$;

-- ==========================================
-- 5. AI CHAT HISTORY SETTING UP
-- ==========================================
-- Saves contextual question sessions between users and Gemini AI globally across docs
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Chat requester Session ID
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE, -- Context note ID 
    messages JSONB DEFAULT '[]'::jsonb, -- Stringified array holding specific msg structural dictionaries
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- Chat state updated log
    PRIMARY KEY (user_id, note_id) -- Enable overwriting session logs reliably per user, per sheet
);

ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own chat histories" ON public.ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Write chat histories" ON public.ai_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update chat histories" ON public.ai_chat_history FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 6. USER ANNOTATIONS SETTING UP
-- ==========================================
-- Saves visual strokes, drawings, highlighting from PDFViewer integration
CREATE TABLE IF NOT EXISTS public.user_annotations (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
    annotations_data JSONB DEFAULT '[]'::jsonb, -- Array holding SVG path stroke metadata array
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, note_id) -- Required for precise UPSERT override methodology internally 
);

ALTER TABLE public.user_annotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own annotations view" ON public.user_annotations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Write annotations" ON public.user_annotations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update annotations" ON public.user_annotations FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 7. STORAGE BUCKET SETTING UP
-- ==========================================
-- Insert 'note_bucket' instance into the database buckets record manually making integration safe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('note_bucket', 'note_bucket', true)
ON CONFLICT (id) DO NOTHING; -- Pass automatically if it already exists

-- Allow public fetching of bucket assets for standard preview and read requests inside the application
CREATE POLICY "Public note access" ON storage.objects
FOR SELECT USING (bucket_id = 'note_bucket');

-- Allow securely authenticated users to push their PDFs over the Network securely
CREATE POLICY "Auth individual upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'note_bucket' AND auth.role() = 'authenticated');
