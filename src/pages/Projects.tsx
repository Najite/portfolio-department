import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Github, ExternalLink, Calendar, Users, Lightbulb, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch all department projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['department-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Filter projects based on search and status
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'planning':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'planning':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Department Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Innovative projects and research initiatives developed by our computer science department
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {['active', 'completed', 'paused', 'planning'].map((status) => {
            const count = projects?.filter(p => p.status === status).length || 0;
            return (
              <Card key={status} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-2`}></div>
                    <div className="text-2xl font-bold">{count}</div>
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">{status}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            {filteredProjects?.length || 0} {filteredProjects?.length === 1 ? 'project' : 'projects'} found
          </p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects?.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or selected filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects?.map((project) => (
              <Card key={project.id} className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-accent flex-shrink-0" />
                      {project.title}
                    </CardTitle>
                    <Badge variant={getStatusVariant(project.status)} className="ml-2 capitalize">
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="space-y-2">
                    {project.team_members && project.team_members.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span className="text-xs">{project.team_members.slice(0, 2).join(', ')}</span>
                        {project.team_members.length > 2 && (
                          <span className="text-xs">+{project.team_members.length - 2} more</span>
                        )}
                      </div>
                    )}
                    {project.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">Started {new Date(project.start_date).getFullYear()}</span>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {project.description}
                  </p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Technologies</div>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {project.image_url && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2 border-t">
                    {project.project_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Have a Project Idea?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our department and contribute to innovative computer science projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Lightbulb className="mr-2 h-4 w-4" />
              Propose Project
            </Button>
            <Button variant="outline" size="lg">
              Collaboration Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;