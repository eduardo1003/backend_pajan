-- Enable admin users to create users without email confirmation
-- This is done by creating a function that admins can use to create confirmed users

CREATE OR REPLACE FUNCTION public.admin_create_user(
  user_email text,
  user_password text,
  user_full_name text,
  user_role user_role DEFAULT 'citizen',
  user_department_id uuid DEFAULT NULL
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

  -- Create the user in auth.users with email confirmed
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
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(),
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
    now()
  ) RETURNING id INTO new_user_id;

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
      'message', 'Failed to create user'
    );
    RETURN result;
END;
$$;