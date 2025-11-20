import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, fullName, role, departmentId } = req.body;
  if (!email || !password || !fullName || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Crear usuario SIN confirmar el email automáticamente
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      // NO poner email_confirm: true
      user_metadata: { full_name: fullName, role, department_id: departmentId || null },
    });
    if (error) throw error;

    // Actualizar el perfil en la tabla profiles
    if (data.user) {
      await supabase.from('profiles').update({
        full_name: fullName,
        role,
        department_id: departmentId || null,
      }).eq('user_id', data.user.id);
    }

    return res.status(200).json({
      success: true,
      user: data.user,
      message: 'Usuario creado. Se ha enviado un correo de confirmación. El usuario debe confirmar su email para poder acceder.'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error creating user' });
  }
} 