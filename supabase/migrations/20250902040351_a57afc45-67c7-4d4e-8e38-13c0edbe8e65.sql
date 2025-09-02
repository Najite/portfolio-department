-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'lecturer', 'student');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add status field to research_papers for approval workflow
ALTER TABLE public.research_papers 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Update RLS policies for research_papers to include approval status
DROP POLICY IF EXISTS "Anyone can view published research papers" ON public.research_papers;

CREATE POLICY "Anyone can view approved research papers"
ON public.research_papers
FOR SELECT
USING (approval_status = 'approved');

CREATE POLICY "Authors and admins can view all their papers"
ON public.research_papers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM lecturers 
    WHERE lecturers.id = research_papers.lecturer_id 
    AND lecturers.user_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin')
);

-- Admins can update approval status
CREATE POLICY "Admins can update approval status"
ON public.research_papers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add student_papers table for student research submissions
CREATE TABLE public.student_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[] NOT NULL,
  keywords TEXT[],
  journal_or_conference TEXT,
  publication_date DATE,
  file_url TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  supervisor_id UUID REFERENCES lecturers(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_papers
ALTER TABLE public.student_papers ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_papers
CREATE POLICY "Anyone can view approved student papers"
ON public.student_papers
FOR SELECT
USING (approval_status = 'approved');

CREATE POLICY "Students can manage their own papers"
ON public.student_papers
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all student papers"
ON public.student_papers
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_student_papers_updated_at
BEFORE UPDATE ON public.student_papers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add approval_status to department_projects
ALTER TABLE public.department_projects 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Update RLS for department_projects
DROP POLICY IF EXISTS "Anyone can view department projects" ON public.department_projects;

CREATE POLICY "Anyone can view approved department projects"
ON public.department_projects
FOR SELECT
USING (approval_status = 'approved');

CREATE POLICY "Authenticated users can view all department projects"
ON public.department_projects
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage department projects approval"
ON public.department_projects
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));