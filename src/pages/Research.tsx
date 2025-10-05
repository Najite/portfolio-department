import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, ExternalLink, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Research = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  // Fetch all research papers
  const { data: papers, isLoading } = useQuery({
    queryKey: ['research-papers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_papers')
        .select(`
          *,
          lecturers (name, title, email)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Extract all unique keywords
  const allKeywords = papers?.reduce((acc: string[], paper) => {
    if (paper.keywords) {
      acc.push(...paper.keywords);
    }
    return acc;
  }, []);
  
  const uniqueKeywords = [...new Set(allKeywords)].slice(0, 20);

  // Filter papers based on search and selected keyword
  const filteredPapers = papers?.filter(paper => {
    const matchesSearch = searchQuery === '' || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors?.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesKeyword = selectedKeyword === null || 
      paper.keywords?.includes(selectedKeyword);
    
    return matchesSearch && matchesKeyword;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Research Publications
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our faculty's groundbreaking research contributions across various fields of computer science
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, abstract, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          
          {/* Keywords Filter */}
          <div className="text-center">
            <div className="inline-flex flex-wrap gap-2 max-w-4xl">
              <Button
                variant={selectedKeyword === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedKeyword(null)}
                className="mb-2"
              >
                All Topics
              </Button>
              {uniqueKeywords?.map((keyword) => (
                <Button
                  key={keyword}
                  variant={selectedKeyword === keyword ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedKeyword(selectedKeyword === keyword ? null : keyword)}
                  className="mb-2"
                >
                  {keyword}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            {filteredPapers?.length || 0} research {filteredPapers?.length === 1 ? 'paper' : 'papers'} found
          </p>
        </div>

        {/* Papers Grid */}
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
        ) : filteredPapers?.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No papers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or selected filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPapers?.map((paper) => (
              <Card key={paper.id} className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <CardTitle className="line-clamp-3 group-hover:text-primary transition-colors">
                    {paper.title}
                  </CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{paper.lecturers?.name}</span>
                    </div>
                    {paper.publication_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(paper.publication_date).getFullYear()}</span>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {paper.abstract}
                  </p>
                  
                  {paper.journal_or_conference && (
                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      Published in: {paper.journal_or_conference}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {paper.keywords?.slice(0, 4).map((keyword) => (
                      <Badge 
                        key={keyword} 
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => setSelectedKeyword(keyword)}
                      >
                        {keyword}
                      </Badge>
                    ))}
                    {paper.keywords && paper.keywords.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{paper.keywords.length - 4} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      {paper.authors?.join(', ')}
                    </div>
                    {paper.file_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={paper.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button (future enhancement) */}
        {filteredPapers && filteredPapers.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              Showing {filteredPapers.length} research papers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;