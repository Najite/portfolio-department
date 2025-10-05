import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import LecturerDashboard from '@/components/dashboard/LecturerDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { isAdmin, isLecturer, isStudent, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const renderDashboard = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    } else if (isLecturer) {
      return <LecturerDashboard />;
    } else if (isStudent) {
      return <StudentDashboard />;
    } else {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to the CS Department Portal</h2>
          <p className="text-muted-foreground mb-6">
            Please contact an administrator to assign you a role to access the dashboard features.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;