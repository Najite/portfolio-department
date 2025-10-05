import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Globe, User, BookOpen, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Lecturers = () => {
  // Fetch all lecturers with their research paper counts
  const { data: lecturers, isLoading } = useQuery({
    queryKey: ['lecturers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lecturers')
        .select(`
          *,
          research_papers (count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Our Department
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
           Computer Science Department was founded in 2008 with a mission to advance the field of computing through research and education. The first NACOS President was Comrade Femi.
          </p>
        </div>

        {/* Stats Section */}
        {/* <div className="grid md:grid-cols-3 gap-8 mb-16"> */}
          {/* <Card className="text-center"> */}
            {/* <CardContent className="pt-6"> */}
              {/* <div className="text-3xl font-bold text-primary mb-2">{lecturers?.length || 0}</div> */}
              {/* <div className="text-muted-foreground">Faculty Members</div> */}
            {/* </CardContent> */}
          {/* </Card> */}
          {/* <Card className="text-center"> */}
            {/* <CardContent className="pt-6"> */}
              {/* <div className="text-3xl font-bold text-primary mb-2">15+</div> */}
              {/* <div className="text-muted-foreground">Research Areas</div> */}
            {/* </CardContent> */}
          {/* </Card> */}
          {/* <Card className="text-center"> */}
            {/* <CardContent className="pt-6"> */}
              {/* <div className="text-3xl font-bold text-primary mb-2">100+</div> */}
              {/* <div className="text-muted-foreground">Publications</div> */}
            {/* </CardContent> */}
          {/* </Card> */}
        {/* </div> */}

        {/* Faculty Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
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
        ) : lecturers?.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No faculty profiles yet</h3>
              <p className="text-muted-foreground">
                Faculty members can create their profiles by signing in to the dashboard
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lecturers?.map((lecturer) => (
              <Card key={lecturer.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    {lecturer.profile_image_url ? (
                      <img
                        src={lecturer.profile_image_url}
                        alt={lecturer.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-background shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-background shadow-lg">
                        <User className="w-10 h-10 text-primary" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {lecturer.name}
                  </CardTitle>
                  <CardDescription>
                    {lecturer.title || 'Faculty Member'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {lecturer.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {lecturer.bio}
                    </p>
                  )}
                  
                  {lecturer.research_interests && lecturer.research_interests.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Research Interests</div>
                      <div className="flex flex-wrap gap-1">
                        {lecturer.research_interests.slice(0, 3).map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {lecturer.research_interests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{lecturer.research_interests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Research Papers Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{lecturer.research_papers?.[0]?.count || 0} Publications</span>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="flex gap-2 pt-2 border-t">
                    {lecturer.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${lecturer.email}`}>
                          <Mail className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    {lecturer.website_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={lecturer.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3 w-3" />
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
          <h2 className="text-3xl font-bold mb-4">Join Our Faculty</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Are you a researcher or educator interested in contributing to our department?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
            <Button variant="outline" size="lg">
              View Opportunities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecturers;