-- Primero corregir la función admin_create_user para que funcione correctamente
DROP FUNCTION IF EXISTS public.admin_create_user(text, text, text, user_role, uuid);

CREATE OR REPLACE FUNCTION public.admin_create_user(
  user_email text,
  user_password text,
  user_full_name text,
  user_role user_role DEFAULT 'citizen'::user_role,
  user_department_id uuid DEFAULT NULL::uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can create users directly';
  END IF;

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    result := json_build_object(
      'success', false,
      'error', 'User already exists',
      'message', 'A user with this email already exists'
    );
    RETURN result;
  END IF;

  -- Generate new user ID
  new_user_id := gen_random_uuid();

  -- Create the user in auth.users with email confirmed (no verification needed)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    email_change_sent_at,
    email_change,
    email_change_confirm_status,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_new,
    email_change_token_current,
    confirmed_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(), -- Email confirmed immediately
    now(),
    '',
    null,
    '',
    null,
    '',
    0,
    null,
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('full_name', user_full_name),
    false,
    now(),
    now(),
    null,
    null,
    '',
    '',
    null,
    '',
    '',
    now() -- Confirmed immediately
  );

  -- Create the profile
  INSERT INTO public.profiles (
    user_id,
    full_name,
    role,
    department_id
  ) VALUES (
    new_user_id,
    user_full_name,
    user_role,
    user_department_id
  );

  -- Return success result
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'User created successfully'
  );

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to create user: ' || SQLERRM
    );
    RETURN result;
END;
$$;

-- Crear tabla para eventos/publicaciones de participación ciudadana
CREATE TABLE public.citizen_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on citizen_events
ALTER TABLE public.citizen_events ENABLE ROW LEVEL SECURITY;

-- Policies for citizen_events
CREATE POLICY "Everyone can view published events" ON public.citizen_events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all events" ON public.citizen_events
  FOR ALL USING (is_admin(auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_citizen_events_updated_at
  BEFORE UPDATE ON public.citizen_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();