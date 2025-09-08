-- Create lecturers/profiles table
CREATE TABLE public.lecturers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  bio TEXT,
  research_interests TEXT[],
  profile_image_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create research papers table
CREATE TABLE public.research_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lecturer_id UUID REFERENCES public.lecturers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[] NOT NULL,
  publication_date DATE,
  journal_or_conference TEXT,
  keywords TEXT[],
  file_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'under_review', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create department projects table
CREATE TABLE public.department_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  team_members TEXT[],
  technologies TEXT[],
  project_url TEXT,
  github_url TEXT,
  image_url TEXT,
  start_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for lecturers table
CREATE POLICY "Anyone can view lecturer profiles" 
ON public.lecturers 
FOR SELECT 
USING (true);

CREATE POLICY "Lecturers can update their own profile" 
ON public.lecturers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create lecturer profile" 
ON public.lecturers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for research papers
CREATE POLICY "Anyone can view published research papers" 
ON public.research_papers 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Lecturers can manage their own research papers" 
ON public.research_papers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.lecturers 
    WHERE lecturers.id = research_papers.lecturer_id 
    AND lecturers.user_id = auth.uid()
  )
);

-- Create policies for department projects
CREATE POLICY "Anyone can view department projects" 
ON public.department_projects 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage department projects" 
ON public.department_projects 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for research files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('research-files', 'research-files', false);

-- Create storage policies for research files
CREATE POLICY "Authenticated users can upload research files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'research-files' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Anyone can view research files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'research-files');

CREATE POLICY "Users can update their own research files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'research-files' 
  AND auth.uid() IS NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_lecturers_updated_at
  BEFORE UPDATE ON public.lecturers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_papers_updated_at
  BEFORE UPDATE ON public.research_papers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_department_projects_updated_at
  BEFORE UPDATE ON public.department_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();