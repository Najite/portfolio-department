import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, FileText, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const LecturerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showPaperForm, setShowPaperForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [paperData, setPaperData] = useState({
    title: '',
    abstract: '',
    file_url: '',
  });
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    file_url: '',
  });

  // Fetch lecturer profile
  const { data: profile } = useQuery({
    queryKey: ['lecturer-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('lecturers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch research papers
  const { data: papers } = useQuery({
    queryKey: ['lecturer-papers', user?.id],
    queryFn: async () => {
      if (!user || !profile) return [];
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('lecturer_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!profile,
  });

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['lecturer-projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('department_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Upload research paper mutation
  const uploadPaperMutation = useMutation({
    mutationFn: async (data: typeof paperData) => {
      if (!user || !profile) throw new Error('User not authenticated or profile not found');

      const { error } = await supabase
        .from('research_papers')
        .insert({
          lecturer_id: profile.id,
          title: data.title,
          abstract: data.abstract,
          file_url: data.file_url || null,
          authors: [],
          approval_status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Research paper submitted",
        description: "Your research paper has been submitted for approval.",
      });
      setPaperData({
        title: '',
        abstract: '',
        file_url: '',
      });
      setShowPaperForm(false);
      queryClient.invalidateQueries({ queryKey: ['lecturer-papers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting paper",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Upload project mutation
  const uploadProjectMutation = useMutation({
    mutationFn: async (data: typeof projectData) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('department_projects')
        .insert({
          title: data.title,
          description: data.description,
          image_url: data.file_url || null,
          approval_status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Project submitted",
        description: "Your project has been submitted for approval.",
      });
      setProjectData({
        title: '',
        description: '',
        file_url: '',
      });
      setShowProjectForm(false);
      queryClient.invalidateQueries({ queryKey: ['lecturer-projects'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const createLecturerProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('user_id', user.id)
        .maybeSingle();

      const { error } = await supabase
        .from('lecturers')
        .insert({
          user_id: user.id,
          name: userProfile?.display_name || 'New Lecturer',
          email: userProfile?.email || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Profile created",
        description: "Your lecturer profile has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['lecturer-profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lecturer Profile Not Found</h3>
            <p className="text-muted-foreground mb-4">
              Your lecturer profile hasn't been created yet. Click the button below to create it.
            </p>
            <Button
              onClick={() => createLecturerProfileMutation.mutate()}
              disabled={createLecturerProfileMutation.isPending}
            >
              {createLecturerProfileMutation.isPending ? 'Creating...' : 'Create Lecturer Profile'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lecturer Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your research papers and department projects
        </p>
      </div>

      <Tabs defaultValue="papers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="papers">Research Papers</TabsTrigger>
          <TabsTrigger value="projects">Department Projects</TabsTrigger>
        </TabsList>
        
        {/* Research Papers Tab */}
        <TabsContent value="papers">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Research Papers</h2>
              <Button onClick={() => setShowPaperForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Paper
              </Button>
            </div>

            {showPaperForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Research Paper</CardTitle>
                  <CardDescription>
                    Submit a new research paper for approval
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Journal Title</Label>
                    <Input
                      id="title"
                      value={paperData.title}
                      onChange={(e) => setPaperData({ ...paperData, title: e.target.value })}
                      placeholder="Enter journal title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="abstract">Abstract</Label>
                    <Textarea
                      id="abstract"
                      value={paperData.abstract}
                      onChange={(e) => setPaperData({ ...paperData, abstract: e.target.value })}
                      placeholder="Enter paper abstract"
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="file_url">File URL</Label>
                    <Input
                      id="file_url"
                      type="url"
                      value={paperData.file_url}
                      onChange={(e) => setPaperData({ ...paperData, file_url: e.target.value })}
                      placeholder="https://example.com/paper.pdf"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the URL where your paper is hosted (e.g., Google Drive, Dropbox)
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => uploadPaperMutation.mutate(paperData)}
                      disabled={uploadPaperMutation.isPending || !paperData.title || !paperData.abstract}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadPaperMutation.isPending ? 'Submitting...' : 'Submit Paper'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowPaperForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Papers List */}
            <div className="grid gap-4">
              {papers?.map((paper) => (
                <Card key={paper.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="mb-2">{paper.title}</CardTitle>
                        <CardDescription>
                          Submitted on {new Date(paper.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(paper.approval_status || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {paper.abstract}
                    </p>
                    {paper.file_url && (
                      <a 
                        href={paper.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Upload className="h-3 w-3" />
                        View Paper
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {papers?.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No research papers yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Submit your first research paper
                    </p>
                    <Button onClick={() => setShowPaperForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Paper
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Department Projects</h2>
              <Button onClick={() => setShowProjectForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Project
              </Button>
            </div>

            {showProjectForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Department Project</CardTitle>
                  <CardDescription>
                    Submit a new project for the department
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input
                      id="project-title"
                      value={projectData.title}
                      onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                      placeholder="Enter project title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={projectData.description}
                      onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                      placeholder="Enter project description"
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="project-file-url">File URL</Label>
                    <Input
                      id="project-file-url"
                      type="url"
                      value={projectData.file_url}
                      onChange={(e) => setProjectData({ ...projectData, file_url: e.target.value })}
                      placeholder="https://example.com/project-document.pdf"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the URL where your project document is hosted
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => uploadProjectMutation.mutate(projectData)}
                      disabled={uploadProjectMutation.isPending || !projectData.title || !projectData.description}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadProjectMutation.isPending ? 'Submitting...' : 'Submit Project'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowProjectForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects List */}
            <div className="grid gap-4">
              {projects?.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="mb-2">{project.title}</CardTitle>
                        <CardDescription>
                          Submitted on {new Date(project.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(project.approval_status || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    {project.image_url && (
                      <a 
                        href={project.image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Upload className="h-3 w-3" />
                        View Project Document
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {projects?.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Submit your first department project
                    </p>
                    <Button onClick={() => setShowProjectForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LecturerDashboard;