import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, FileText, Users, BookOpen } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
      </div>

      <Tabs defaultValue="research-papers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="research-papers">Research Papers</TabsTrigger>
          <TabsTrigger value="student-papers">Student Papers</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
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