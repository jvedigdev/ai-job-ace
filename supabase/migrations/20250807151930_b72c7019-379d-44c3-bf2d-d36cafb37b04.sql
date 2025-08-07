-- Fix the search_path security warnings for functions
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS public.profiles 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT * FROM public.profiles 
  WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT id FROM public.profiles 
  WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  LIMIT 1;
$$;