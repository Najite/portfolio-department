import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'lecturer' | 'student';

export const useRole = () => {
  const { user } = useAuth();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(r => r.role as UserRole);
    },
    enabled: !!user,
  });

  const hasRole = (role: UserRole) => {
    return roles?.includes(role) || false;
  };

  const isAdmin = hasRole('admin');
  const isLecturer = hasRole('lecturer');
  const isStudent = hasRole('student');
  const primaryRole = roles?.[0];

  return {
    roles: roles || [],
    hasRole,
    isAdmin,
    isLecturer,
    isStudent,
    primaryRole,
    isLoading,
  };
};