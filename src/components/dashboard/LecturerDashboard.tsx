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
    authors: '',
    keywords: '',
    journal_or_conference: '',
    publication_date: '',
  });
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    technologies: '',
    team_members: '',
    github_url: '',
    project_url: '',
    start_date: '',
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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
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
      if (!user || !profile) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('research_papers')
        .insert({
          lecturer_id: profile.id,
          title: data.title,
          abstract: data.abstract,
          authors: data.authors.split(',').map(a => a.trim()),
          keywords: data.keywords.split(',').map(k => k.trim()),
          journal_or_conference: data.journal_or_conference,
          publication_date: data.publication_date || null,
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
        authors: '',
        keywords: '',
        journal_or_conference: '',
        publication_date: '',
      });
      setShowPaperForm(false);
      queryClient.invalidateQueries({ queryKey: ['lecturer-papers'] });
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
          technologies: data.technologies.split(',').map(t => t.trim()),
          team_members: data.team_members.split(',').map(m => m.trim()),
          github_url: data.github_url || null,
          project_url: data.project_url || null,
          start_date: data.start_date || null,
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
        technologies: '',
        team_members: '',
        github_url: '',
        project_url: '',
        start_date: '',
      });
      setShowProjectForm(false);
      queryClient.invalidateQueries({ queryKey: ['lecturer-projects'] });
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
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={paperData.title}
                      onChange={(e) => setPaperData({ ...paperData, title: e.target.value })}
                      placeholder="Enter paper title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="abstract">Abstract</Label>
                    <Textarea
                      id="abstract"
                      value={paperData.abstract}
                      onChange={(e) => setPaperData({ ...paperData, abstract: e.target.value })}
                      placeholder="Enter paper abstract"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="authors">Authors (comma-separated)</Label>
                      <Input
                        id="authors"
                        value={paperData.authors}
                        onChange={(e) => setPaperData({ ...paperData, authors: e.target.value })}
                        placeholder="John Doe, Jane Smith"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                      <Input
                        id="keywords"
                        value={paperData.keywords}
                        onChange={(e) => setPaperData({ ...paperData, keywords: e.target.value })}
                        placeholder="machine learning, AI"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="journal">Journal/Conference</Label>
                      <Input
                        id="journal"
                        value={paperData.journal_or_conference}
                        onChange={(e) => setPaperData({ ...paperData, journal_or_conference: e.target.value })}
                        placeholder="Nature, IEEE, ACM"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Publication Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={paperData.publication_date}
                        onChange={(e) => setPaperData({ ...paperData, publication_date: e.target.value })}
                      />
                    </div>
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
                          {paper.authors?.join(', ')} • {paper.journal_or_conference}
                        </CardDescription>
                      </div>
                      {getStatusBadge(paper.approval_status || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {paper.abstract}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {paper.keywords?.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
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
                    <Label htmlFor="project-title">Title</Label>
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
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                      <Input
                        id="technologies"
                        value={projectData.technologies}
                        onChange={(e) => setProjectData({ ...projectData, technologies: e.target.value })}
                        placeholder="React, Node.js, Python"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="team">Team Members (comma-separated)</Label>
                      <Input
                        id="team"
                        value={projectData.team_members}
                        onChange={(e) => setProjectData({ ...projectData, team_members: e.target.value })}
                        placeholder="John Doe, Jane Smith"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        value={projectData.github_url}
                        onChange={(e) => setProjectData({ ...projectData, github_url: e.target.value })}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="project-url">Project URL</Label>
                      <Input
                        id="project-url"
                        value={projectData.project_url}
                        onChange={(e) => setProjectData({ ...projectData, project_url: e.target.value })}
                        placeholder="https://project-demo.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={projectData.start_date}
                      onChange={(e) => setProjectData({ ...projectData, start_date: e.target.value })}
                    />
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
                          Team: {project.team_members?.join(', ')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(project.approval_status || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
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