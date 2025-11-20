export async function createAdminUser({ email, password, fullName, role, departmentId }: {
  email: string;
  password: string;
  fullName: string;
  role: string;
  departmentId?: string;
}) {
  const res = await fetch('/api/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, role, departmentId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error creando usuario');
  return data.user;
} 