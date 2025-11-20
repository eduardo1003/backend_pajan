-- Delete existing data if any
DELETE FROM public.category_department_mapping;
DELETE FROM public.departments;

-- Insert test departments first
INSERT INTO public.departments (id, name, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Departamento de Vialidad', 'Encargado de mantenimiento de calles y vías públicas', true),
('550e8400-e29b-41d4-a716-446655440002', 'Departamento de Salud', 'Gestión de servicios de salud pública', true),
('550e8400-e29b-41d4-a716-446655440003', 'Departamento de Ambiente', 'Protección y gestión ambiental', true),
('550e8400-e29b-41d4-a716-446655440004', 'Departamento de Seguridad', 'Seguridad pública y ciudadana', true);

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