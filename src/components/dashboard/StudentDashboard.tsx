import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, FileText, GraduationCap, User, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showPaperForm, setShowPaperForm] = useState(false);
  const [profileData, setProfileData] = useState({
    display_name: '',
    matric_number: '',
  });
  const [paperData, setPaperData] = useState({
    title: '',
    abstract: '',
    authors: '',
    keywords: '',
    journal_or_conference: '',
    publication_date: '',
    supervisor_id: '',
  });

  // Fetch student profile
  const { data: profile } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update profile data when profile is loaded
  useState(() => {
    if (profile) {
      setProfileData({
        display_name: profile.display_name || '',
        matric_number: profile.matric_number || '',
      });
    }
  }, [profile]);

  // Fetch lecturers for supervisor selection
  const { data: lecturers } = useQuery({
    queryKey: ['lecturers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lecturers')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch student papers
  const { data: papers } = useQuery({
    queryKey: ['student-papers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('student_papers')
        .select('*, lecturers(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: data.display_name,
          matric_number: data.matric_number,
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating profile",
        description: error.message.includes('profiles_matric_number_key') 
          ? "This matric number is already taken by another student."
          : error.message,
        variant: "destructive",
      });
    },
  });

  // Upload research paper mutation
  const uploadPaperMutation = useMutation({
    mutationFn: async (data: typeof paperData) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('student_papers')
        .insert({
          user_id: user.id,
          title: data.title,
          abstract: data.abstract,
          authors: data.authors.split(',').map(a => a.trim()).filter(a => a),
          keywords: data.keywords.split(',').map(k => k.trim()).filter(k => k),
          journal_or_conference: data.journal_or_conference || null,
          publication_date: data.publication_date || null,
          supervisor_id: data.supervisor_id || null,
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
        supervisor_id: '',
      });
      setShowPaperForm(false);
      queryClient.invalidateQueries({ queryKey: ['student-papers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting paper",
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

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Submit and manage your research papers
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="papers">Research Papers</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Profile
              </CardTitle>
              <CardDescription>
                Update your personal information and academic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="display_name">Full Name</Label>
                <Input
                  id="display_name"
                  value={profileData.display_name}
                  onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="matric_number">Matric Number</Label>
                <Input
                  id="matric_number"
                  value={profileData.matric_number}
                  onChange={(e) => setProfileData({ ...profileData, matric_number: e.target.value })}
                  placeholder="Enter your matric number (e.g., CS/2020/001)"
                />
              </div>
              
              <Button 
                onClick={() => updateProfileMutation.mutate(profileData)}
                disabled={updateProfileMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
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
                Submit your research paper for approval by the department
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
                    placeholder="Your Name, Co-author"
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
                    placeholder="Journal name or conference"
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
              
              <div>
                <Label htmlFor="supervisor">Supervisor (Optional)</Label>
                <Select 
                  value={paperData.supervisor_id} 
                  onValueChange={(value) => setPaperData({ ...paperData, supervisor_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers?.map((lecturer) => (
                      <SelectItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      By: {paper.authors?.join(', ')}
                      {paper.lecturers?.name && ` • Supervisor: ${paper.lecturers.name}`}
                    </CardDescription>
                  </div>
                  {getStatusBadge(paper.approval_status || 'pending')}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {paper.abstract}
                </p>
                {paper.journal_or_conference && (
                  <p className="text-sm font-medium mb-2">
                    Published in: {paper.journal_or_conference}
                  </p>
                )}
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
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No research papers yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Submit your first research paper to showcase your work
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
      </Tabs>
    </div>
  );
};

export default StudentDashboard;