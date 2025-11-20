import { useState, useEffect, createContext, useContext } from 'react';
import { apiClient } from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  profile: any | null;
}

interface AuthContextType {
  user: User | null;
  session: { token: string } | null;
  profile: any | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiClient.setToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const { user: userData } = await apiClient.getCurrentUser();
      setUser(userData);
      setProfile(userData.profile);
      setSession({ token: localStorage.getItem('auth_token') || '' });
    } catch (error: any) {
      console.error('Error loading user:', error);
      apiClient.logout();
      setUser(null);
      setProfile(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { user: newUser, token } = await apiClient.register(email, password, fullName);
      
      setUser(newUser);
      setProfile(newUser.profile);
      setSession({ token });
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error de registro",
        description: error.message || "Ocurrió un error al registrar",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await apiClient.login(email, password);
      
      setUser(userData);
      setProfile(userData.profile);
      setSession({ token });
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      apiClient.logout();
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      signUp,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
