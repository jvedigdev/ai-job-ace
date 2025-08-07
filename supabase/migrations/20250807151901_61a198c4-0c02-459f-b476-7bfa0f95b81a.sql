-- Create profiles table to store Clerk user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create function to get current user profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS public.profiles AS $$
  SELECT * FROM public.profiles 
  WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to get current user ID
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update applications table RLS policies
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.applications;

CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can create their own applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Users can update their own applications" 
ON public.applications 
FOR UPDATE 
USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can delete their own applications" 
ON public.applications 
FOR DELETE 
USING (user_id = public.get_current_user_id());

-- Update documents table RLS policies
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

CREATE POLICY "Users can view their own documents" 
ON public.documents 
FOR SELECT 
USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can create their own documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Users can update their own documents" 
ON public.documents 
FOR UPDATE 
USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can delete their own documents" 
ON public.documents 
FOR DELETE 
USING (user_id = public.get_current_user_id());

-- Update jobs table RLS policies
DROP POLICY IF EXISTS "Users can view their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can create their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can update their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can delete their own jobs" ON public.jobs;

CREATE POLICY "Users can view their own jobs" 
ON public.jobs 
FOR SELECT 
USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can create their own jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Users can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can delete their own jobs" 
ON public.jobs 
FOR DELETE 
USING (user_id = public.get_current_user_id());

-- Update application_documents table RLS policies
DROP POLICY IF EXISTS "Users can view their own application documents" ON public.application_documents;
DROP POLICY IF EXISTS "Users can create their own application documents" ON public.application_documents;
DROP POLICY IF EXISTS "Users can delete their own application documents" ON public.application_documents;

CREATE POLICY "Users can view their own application documents" 
ON public.application_documents 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.applications 
  WHERE applications.id = application_documents.application_id 
  AND applications.user_id = public.get_current_user_id()
));

CREATE POLICY "Users can create their own application documents" 
ON public.application_documents 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.applications 
  WHERE applications.id = application_documents.application_id 
  AND applications.user_id = public.get_current_user_id()
));

CREATE POLICY "Users can delete their own application documents" 
ON public.application_documents 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.applications 
  WHERE applications.id = application_documents.application_id 
  AND applications.user_id = public.get_current_user_id()
));

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();