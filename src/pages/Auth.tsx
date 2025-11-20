import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Users, FileText, UserPlus } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (!error) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-pajan-blue to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">GAD Paján</h1>
          <p className="text-gray-600 text-lg">
            Participación Ciudadana
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pajan-blue to-blue-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center mb-8">
          <div className="space-y-2 p-3 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-pajan-red" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Reportar</p>
          </div>
          <div className="space-y-2 p-3 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-pajan-blue" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Geolocalización</p>
          </div>
          <div className="space-y-2 p-3 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-pajan-green" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Seguimiento</p>
          </div>
        </div>

        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pajan-blue to-blue-500 text-white text-center py-6">
            <CardTitle className="text-xl font-semibold">Acceder a tu cuenta</CardTitle>
            <p className="text-blue-100 text-sm">Únete a la participación ciudadana</p>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue"
                >
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-6 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-pajan-blue focus:ring-pajan-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-pajan-blue focus:ring-pajan-blue"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-pajan-blue to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-6 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Nombre completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-pajan-blue focus:ring-pajan-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Correo electrónico</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-pajan-blue focus:ring-pajan-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-pajan-blue focus:ring-pajan-blue"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-pajan-green to-green-500 hover:from-green-600 hover:to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Botones de navegación */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-pajan-blue"
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}