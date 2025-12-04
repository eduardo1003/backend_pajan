-- Crear tabla de categorías
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas para categorías
CREATE POLICY "Everyone can view active categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (is_admin(auth.uid()));

-- Insertar categorías por defecto
INSERT INTO public.categories (name, description, icon, color) VALUES
('vialidad', 'Problemas de calles, aceras, baches y señalización', 'Road', '#3B82F6'),
('salud', 'Temas de salud pública y centros médicos', 'Heart', '#EF4444'),
('ambiente', 'Contaminación, espacios verdes y medio ambiente', 'Leaf', '#10B981'),
('seguridad', 'Seguridad ciudadana y emergencias', 'Shield', '#F59E0B'),
('alumbrado', 'Problemas con el alumbrado público', 'Lightbulb', '#FBBF24'),
('agua_alcantarillado', 'Servicios de agua potable y alcantarillado', 'Droplets', '#06B6D4'),
('transporte', 'Transporte público y movilidad', 'Bus', '#8B5CF6'),
('maltrato_animal', 'Denuncias de maltrato animal', 'Dog', '#F97316'),
('basura', 'Recolección de basura y limpieza', 'Trash2', '#6B7280'),
('otros', 'Otros problemas no categorizados', 'AlertCircle', '#64748B');

-- Trigger para updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();