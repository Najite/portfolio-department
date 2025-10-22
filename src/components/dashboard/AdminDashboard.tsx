import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, FileText, Users, BookOpen, UserCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending research papers
  const { data: pendingPapers } = useQuery({
    queryKey: ['pending-research-papers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_papers')
        .select('*, lecturers(name)')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch pending student papers
  const { data: pendingStudentPapers } = useQuery({
    queryKey: ['pending-student-papers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_papers')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch pending projects
  const { data: pendingProjects } = useQuery({
    queryKey: ['pending-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_projects')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all users for management
  const { data: allUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Then get user roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id);
          
          return {
            ...profile,
            user_roles: roles || []
          };
        })
      );
      
      return usersWithRoles;
    },
  });

  // Approve/Reject mutation for research papers
  const updatePaperStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('research_papers')
        .update({ approval_status: status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast({
        title: `Paper ${status}`,
        description: `Research paper has been ${status} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['pending-research-papers'] });
    },
  });

  // Approve/Reject mutation for student papers
  const updateStudentPaperStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('student_papers')
        .update({ approval_status: status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast({
        title: `Student paper ${status}`,
        description: `Student paper has been ${status} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['pending-student-papers'] });
    },
  });

  // Approve/Reject mutation for projects
  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('department_projects')
        .update({ approval_status: status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast({
        title: `Project ${status}`,
        description: `Project has been ${status} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['pending-projects'] });
    },
  });

  // Approve/Reject user mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast({
        title: `User ${status}`,
        description: `User has been ${status} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: 'admin' | 'lecturer' | 'student' }) => {
      // First, check if the user already has this role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', role)
        .maybeSingle();

      if (existingRole) {
        throw new Error('User already has this role');
      }

      // Insert the role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (roleError) throw roleError;

      // If assigning lecturer role, create a lecturer profile
      if (role === 'lecturer') {
        // Get user's profile info
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, email')
          .eq('user_id', userId)
          .maybeSingle();

        // Check if lecturer profile already exists
        const { data: existingLecturer } = await supabase
          .from('lecturers')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (!existingLecturer) {
          // Create lecturer profile
          const { error: lecturerError } = await supabase
            .from('lecturers')
            .insert({
              user_id: userId,
              name: profile?.display_name || 'New Lecturer',
              email: profile?.email || null,
            });

          if (lecturerError) throw lecturerError;
        }
      }
    },
    onSuccess: () => {
      toast({
        title: 'Role assigned',
        description: 'User role has been assigned successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Review and approve submitted content
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Research Papers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPapers?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Student Papers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingStudentPapers?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Projects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingProjects?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="research-papers">Research Papers</TabsTrigger>
          <TabsTrigger value="student-papers">Student Papers</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        {/* User Management Tab */}
        <TabsContent value="users">
          <div className="space-y-4">
            {allUsers?.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground">No users have registered yet</p>
                </CardContent>
              </Card>
            )}
            
            {allUsers?.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">{user.display_name || 'No name'}</CardTitle>
                      <CardDescription>
                        {user.email}
                        {user.matric_number && ` • Matric: ${user.matric_number}`}
                        • Joined {new Date(user.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(user.status)}
                      {user.user_roles && user.user_roles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {user.user_roles.map((role: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {role.role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => updateUserStatusMutation.mutate({ userId: user.user_id, status: 'approved' })}
                          disabled={updateUserStatusMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve User
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => updateUserStatusMutation.mutate({ userId: user.user_id, status: 'rejected' })}
                          disabled={updateUserStatusMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject User
                        </Button>
                      </div>
                    )}
                    
                    {user.status === 'approved' && (
                      <div className="flex gap-2 items-center">
                        <Select onValueChange={(role) => assignRoleMutation.mutate({ userId: user.user_id, role: role as any })}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Assign role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Research Papers Tab */}
        <TabsContent value="research-papers">
          <div className="space-y-4">
            {pendingPapers?.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending research papers</h3>
                  <p className="text-muted-foreground">All research papers have been reviewed</p>
                </CardContent>
              </Card>
            )}
            
            {pendingPapers?.map((paper) => (
              <Card key={paper.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">{paper.title}</CardTitle>
                      <CardDescription>
                        By: {paper.lecturers?.name} • {paper.authors?.join(', ')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(paper.approval_status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {paper.abstract}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => updatePaperStatusMutation.mutate({ id: paper.id, status: 'approved' })}
                      disabled={updatePaperStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => updatePaperStatusMutation.mutate({ id: paper.id, status: 'rejected' })}
                      disabled={updatePaperStatusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Student Papers Tab */}
        <TabsContent value="student-papers">
          <div className="space-y-4">
            {pendingStudentPapers?.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending student papers</h3>
                  <p className="text-muted-foreground">All student papers have been reviewed</p>
                </CardContent>
              </Card>
            )}
            
            {pendingStudentPapers?.map((paper) => (
              <Card key={paper.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">{paper.title}</CardTitle>
                      <CardDescription>
                        By: {paper.authors?.join(', ')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(paper.approval_status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {paper.abstract}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => updateStudentPaperStatusMutation.mutate({ id: paper.id, status: 'approved' })}
                      disabled={updateStudentPaperStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStudentPaperStatusMutation.mutate({ id: paper.id, status: 'rejected' })}
                      disabled={updateStudentPaperStatusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="space-y-4">
            {pendingProjects?.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending projects</h3>
                  <p className="text-muted-foreground">All projects have been reviewed</p>
                </CardContent>
              </Card>
            )}
            
            {pendingProjects?.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">{project.title}</CardTitle>
                      <CardDescription>
                        Team: {project.team_members?.join(', ')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(project.approval_status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => updateProjectStatusMutation.mutate({ id: project.id, status: 'approved' })}
                      disabled={updateProjectStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => updateProjectStatusMutation.mutate({ id: project.id, status: 'rejected' })}
                      disabled={updateProjectStatusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;