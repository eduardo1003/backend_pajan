import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { MobileNavigation } from "./components/MobileNavigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewReport from "./pages/NewReport";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TestUsers from "./pages/TestUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import PublicIncidents from "./pages/PublicIncidents";
import PublicEvents from "./pages/PublicEvents";
import AllReports from "./pages/AllReports";
import Map from "./pages/Map";
import CitizenParticipation from "./pages/CitizenParticipation";
import Contact from "./pages/Contact";
import BarrioPresidents from "./pages/BarrioPresidents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <MobileNavigation />
      <Navbar />
      <main className="w-full">
        <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/new-report" 
                element={
                  <ProtectedRoute requiredRole={['citizen']}>
                    <NewReport />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department" 
                element={
                  <ProtectedRoute requiredRole={['department_head', 'department_staff']}>
                    <DepartmentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="/test-users" element={<TestUsers />} />
              <Route path="/public-incidents" element={<PublicIncidents />} />
              <Route path="/public-events" element={<PublicEvents />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/barrio-presidents" element={<BarrioPresidents />} />
              <Route 
                path="/admin/all-reports" 
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <AllReports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/map" 
                element={
                  <ProtectedRoute>
                    <Map />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/participation" 
                element={
                  <ProtectedRoute>
                    <CitizenParticipation />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
