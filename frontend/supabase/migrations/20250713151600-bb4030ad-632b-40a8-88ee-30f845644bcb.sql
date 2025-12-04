-- Insert test departments
INSERT INTO public.departments (id, name, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Departamento de Vialidad', 'Encargado de mantenimiento de calles y vías públicas', true),
('550e8400-e29b-41d4-a716-446655440002', 'Departamento de Salud', 'Gestión de servicios de salud pública', true),
('550e8400-e29b-41d4-a716-446655440003', 'Departamento de Ambiente', 'Protección y gestión ambiental', true),
('550e8400-e29b-41d4-a716-446655440004', 'Departamento de Seguridad', 'Seguridad pública y ciudadana', true);

-- Insert test profiles (users)
INSERT INTO public.profiles (id, user_id, full_name, role, department_id, phone, is_active) VALUES
-- Admin user
('650e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000001', 'Carlos Administrador', 'admin', NULL, '+1234567890', true),
-- Department heads
('650e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000002', 'María Vialidad', 'department_head', '550e8400-e29b-41d4-a716-446655440001', '+1234567891', true),
('650e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000003', 'José Salud', 'department_head', '550e8400-e29b-41d4-a716-446655440002', '+1234567892', true),
-- Department staff
('650e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000004', 'Ana Personal Vialidad', 'department_staff', '550e8400-e29b-41d4-a716-446655440001', '+1234567893', true),
('650e8400-e29b-41d4-a716-446655440005', '00000000-0000-0000-0000-000000000005', 'Luis Personal Ambiente', 'department_staff', '550e8400-e29b-41d4-a716-446655440003', '+1234567894', true),
-- Citizens
('650e8400-e29b-41d4-a716-446655440006', '00000000-0000-0000-0000-000000000006', 'Pedro Ciudadano', 'citizen', NULL, '+1234567895', true),
('650e8400-e29b-41d4-a716-446655440007', '00000000-0000-0000-0000-000000000007', 'Laura Ciudadana', 'citizen', NULL, '+1234567896', true);

-- Insert auth users (this simulates the users in auth.users table)
-- Note: In production, these would be created through Supabase Auth, but for testing we create profiles
-- The actual auth users need to be created through the signup process

-- Insert category mappings
INSERT INTO public.category_department_mapping (category, department_id, is_primary) VALUES
('vialidad', '550e8400-e29b-41d4-a716-446655440001', true),
('salud', '550e8400-e29b-41d4-a716-446655440002', true),
('ambiente', '550e8400-e29b-41d4-a716-446655440003', true),
('seguridad', '550e8400-e29b-41d4-a716-446655440004', true),
('alumbrado', '550e8400-e29b-41d4-a716-446655440001', false),
('agua_alcantarillado', '550e8400-e29b-41d4-a716-446655440003', false),
('transporte', '550e8400-e29b-41d4-a716-446655440001', false),
('maltrato_animal', '550e8400-e29b-41d4-a716-446655440003', false),
('basura', '550e8400-e29b-41d4-a716-446655440003', false);

-- Insert sample incidents
INSERT INTO public.incidents (id, title, description, category, citizen_id, assigned_department_id, status, address, latitude, longitude) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Hueco en calle principal', 'Hay un hueco grande en la calle que puede causar accidentes', 'vialidad', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'pending', 'Calle Principal 123', -1.2345, -78.1234),
('750e8400-e29b-41d4-a716-446655440002', 'Problema con agua potable', 'El agua sale turbia en mi sector', 'agua_alcantarillado', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'in_progress', 'Barrio Los Andes', -1.2355, -78.1244),
('750e8400-e29b-41d4-a716-446655440003', 'Basura acumulada', 'Hace una semana que no recogen la basura', 'basura', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'resolved', 'Sector El Centro', -1.2365, -78.1254);