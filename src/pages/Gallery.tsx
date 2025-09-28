import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';

const Gallery = () => {
  // Using Pexels stock photos for the gallery
  const galleryImages = [
    {
      id: 1,
      url: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Computer Science Lab",
      description: "Students working on programming projects"
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Research Presentation",
      description: "Faculty presenting research findings"
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Coding Workshop",
      description: "Interactive programming workshop"
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Team Collaboration",
      description: "Students collaborating on projects"
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Algorithm Design",
      description: "Whiteboard algorithm discussion"
    },
    {
      id: 6,
      url: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Data Science Lab",
      description: "Working with data visualization"
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Software Development",
      description: "Building innovative applications"
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "AI Research",
      description: "Artificial intelligence research session"
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Network Security",
      description: "Cybersecurity workshop"
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/3861961/pexels-photo-3861961.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Mobile Development",
      description: "Creating mobile applications"
    },
    {
      id: 11,
      url: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Database Design",
      description: "Database architecture planning"
    },
    {
      id: 12,
      url: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Graduation Ceremony",
      description: "Computer Science graduates celebration"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Department Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore moments from our computer science department - from research breakthroughs to student achievements, 
            collaborative projects to graduation celebrations
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 py-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Share Your Moments</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have photos from department events or achievements? We'd love to feature them in our gallery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Submit Photos
            </button>
            <button className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors">
              View More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;