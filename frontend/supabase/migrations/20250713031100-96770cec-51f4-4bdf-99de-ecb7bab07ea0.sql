-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('citizen', 'admin', 'department_head', 'department_staff');

-- Create enum for incident status
CREATE TYPE public.incident_status AS ENUM ('pending', 'in_progress', 'resolved', 'rejected');

-- Create enum for incident categories
CREATE TYPE public.incident_category AS ENUM ('vialidad', 'salud', 'ambiente', 'seguridad', 'alumbrado', 'agua_alcantarillado', 'transporte', 'maltrato_animal', 'basura', 'otros');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  department_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  head_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category incident_category NOT NULL,
  status incident_status DEFAULT 'pending',
  citizen_id UUID NOT NULL REFERENCES public.profiles(id),
  assigned_department_id UUID REFERENCES public.departments(id),
  assigned_staff_id UUID REFERENCES public.profiles(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  evidence_urls TEXT[],
  resolution_description TEXT,
  resolution_evidence_urls TEXT[],
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create category_department_mapping table
CREATE TABLE public.category_department_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category incident_category NOT NULL,
  department_id UUID NOT NULL REFERENCES public.departments(id),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint for department_id in profiles
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_department 
  FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_department_mapping ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

-- Create security definer function to check if user belongs to department
CREATE OR REPLACE FUNCTION public.user_belongs_to_department(user_uuid UUID, dept_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND department_id = dept_id
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for departments
CREATE POLICY "Everyone can view departments" 
ON public.departments FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage departments" 
ON public.departments FOR ALL 
USING (public.is_admin(auth.uid()));

-- RLS Policies for incidents
CREATE POLICY "Citizens can view their own incidents" 
ON public.incidents FOR SELECT 
USING (citizen_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Citizens can create incidents" 
ON public.incidents FOR INSERT 
WITH CHECK (citizen_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Department staff can view assigned incidents" 
ON public.incidents FOR SELECT 
USING (
  assigned_department_id IN (
    SELECT department_id FROM public.profiles WHERE user_id = auth.uid()
  ) OR public.is_admin(auth.uid())
);

CREATE POLICY "Department staff can update assigned incidents" 
ON public.incidents FOR UPDATE 
USING (
  assigned_department_id IN (
    SELECT department_id FROM public.profiles WHERE user_id = auth.uid()
  ) OR assigned_staff_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ) OR public.is_admin(auth.uid())
);

CREATE POLICY "Admins can manage all incidents" 
ON public.incidents FOR ALL 
USING (public.is_admin(auth.uid()));

-- RLS Policies for category_department_mapping
CREATE POLICY "Everyone can view category mappings" 
ON public.category_department_mapping FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage category mappings" 
ON public.category_department_mapping FOR ALL 
USING (public.is_admin(auth.uid()));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'citizen'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default departments
INSERT INTO public.departments (name, description) VALUES
('Recursos Humanos', 'Gestión de personal y recursos humanos'),
('Vialidad y Transporte', 'Mantenimiento de calles, señalización y transporte público'),
('Salud Pública', 'Servicios de salud y prevención'),
('Gestión Ambiental', 'Protección del medio ambiente y gestión de residuos'),
('Seguridad Ciudadana', 'Seguridad pública y prevención del delito'),
('Servicios Públicos', 'Alumbrado, agua, alcantarillado y servicios básicos'),
('Bienestar Animal', 'Protección y bienestar de los animales');

-- Insert category mappings
INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'vialidad', id, true FROM public.departments WHERE name = 'Vialidad y Transporte';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'salud', id, true FROM public.departments WHERE name = 'Salud Pública';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'ambiente', id, true FROM public.departments WHERE name = 'Gestión Ambiental';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'seguridad', id, true FROM public.departments WHERE name = 'Seguridad Ciudadana';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'alumbrado', id, true FROM public.departments WHERE name = 'Servicios Públicos';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'agua_alcantarillado', id, true FROM public.departments WHERE name = 'Servicios Públicos';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'transporte', id, true FROM public.departments WHERE name = 'Vialidad y Transporte';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'maltrato_animal', id, true FROM public.departments WHERE name = 'Bienestar Animal';

INSERT INTO public.category_department_mapping (category, department_id, is_primary) 
SELECT 'basura', id, true FROM public.departments WHERE name = 'Gestión Ambiental';