import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Lightbulb, Github, ExternalLink } from 'lucide-react';
import heroImage from '@/assets/NNL.png';
import Header from '@/components/layout/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Fetch recent research papers
  const { data: recentPapers } = useQuery({
    queryKey: ['recent-papers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_papers')
        .select(`
          *,
          lecturers (name, title)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch featured projects
  const { data: featuredProjects } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('department_projects')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(2);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Excellence in Computing
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                  Computer Science Department
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Pioneering research, innovative solutions, and exceptional education in computer science. 
                  Explore our faculty's groundbreaking work and departmental achievements.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/research">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Explore Research
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/lecturers">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Meet Our Faculty
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-border/50">
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Research Papers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted-foreground">Faculty Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl ">
                <img 
                  src={heroImage} 
                  alt="Computer Science Department" 
                  className="w-full h-[500px] object-fit"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Research Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest Research</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our faculty's most recent contributions to computer science research
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPapers?.map((paper) => (
              <Card key={paper.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{paper.title}</CardTitle>
                  <CardDescription>
                    By {paper.lecturers?.name} • {paper.lecturers?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {paper.abstract}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords?.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/research">
              <Button variant="outline" size="lg">
                <BookOpen className="mr-2 h-4 w-4" />
                View All Research
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Department Projects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Innovative projects developed by our department
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects?.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    {project.title}
                  </CardTitle>
                  <CardDescription>
                    {project.team_members?.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {project.project_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live Demo
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
          
          <div className="text-center mt-12">
            <Link to="/projects">
              <Button variant="outline" size="lg">
                <Lightbulb className="mr-2 h-4 w-4" />
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Collaborate with leading researchers and contribute to cutting-edge computer science projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </Link>
            <Link to="/lecturers">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Meet the Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
