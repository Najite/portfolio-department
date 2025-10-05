import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Globe, Github, Linkedin } from 'lucide-react';
import Header from '@/components/layout/Header';

const Teams = () => {
  // Team members with Pexels stock photos
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Orunsolu",
      role: "Department Head",
      specialization: "Artificial Intelligence",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "sarah.johnson@university.edu",
      website: "https://example.com",
      bio: "Leading researcher in machine learning and neural networks with 15+ years of experience."
    },
    {
      id: 2,
      name: "Dr. Mrs Alaran",
      role: "Senior Lecturer",
      specialization: "Software Engineering",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "michael.chen@university.edu",
      website: "https://example.com",
      bio: "Expert in software architecture and agile development methodologies."
    },
    {
      id: 3,
      name: "Mr Adebayor",
      role: "Associate Professor",
      specialization: "Cybersecurity",
      image: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "emily.rodriguez@university.edu",
      website: "https://example.com",
      bio: "Cybersecurity specialist focusing on network security and ethical hacking."
    },
    {
      id: 4,
      name: "Mr Salawu",
      role: "Lecturer",
      specialization: "Data Science",
      image: "https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "david.kim@university.edu",
      website: "https://example.com",
      bio: "Data scientist with expertise in big data analytics and machine learning."
    },
    {
      id: 5,
      name: "",
      role: "Research Fellow",
      specialization: "Human-Computer Interaction",
      image: "https://images.pexels.com/photos/3861961/pexels-photo-3861961.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "lisa.thompson@university.edu",
      website: "https://example.com",
      bio: "UX researcher focusing on accessibility and inclusive design principles."
    },
    {
      id: 6,
      name: "Prof. James Wilson",
      role: "Senior Lecturer",
      specialization: "Database Systems",
      image: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "james.wilson@university.edu",
      website: "https://example.com",
      bio: "Database expert specializing in distributed systems and NoSQL technologies."
    },
    {
      id: 7,
      name: "Dr. Maria Garcia",
      role: "Assistant Professor",
      specialization: "Computer Graphics",
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "maria.garcia@university.edu",
      website: "https://example.com",
      bio: "Computer graphics researcher with focus on 3D rendering and virtual reality."
    },
    {
      id: 8,
      name: "Prof. Robert Brown",
      role: "Lecturer",
      specialization: "Algorithms",
      image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "robert.brown@university.edu",
      website: "https://example.com",
      bio: "Algorithm specialist with expertise in optimization and computational complexity."
    },
    {
      id: 9,
      name: "Dr. Jennifer Lee",
      role: "Research Associate",
      specialization: "Mobile Computing",
      image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "jennifer.lee@university.edu",
      website: "https://example.com",
      bio: "Mobile computing researcher focusing on IoT and edge computing solutions."
    },
    {
      id: 10,
      name: "Prof. Andrew Davis",
      role: "Senior Lecturer",
      specialization: "Network Systems",
      image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "andrew.davis@university.edu",
      website: "https://example.com",
      bio: "Network systems expert with focus on distributed computing and cloud architecture."
    },
    {
      id: 11,
      name: "Dr. Rachel Martinez",
      role: "Assistant Professor",
      specialization: "Bioinformatics",
      image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "rachel.martinez@university.edu",
      website: "https://example.com",
      bio: "Bioinformatics researcher applying computational methods to biological problems."
    },
    {
      id: 12,
      name: "Prof. Kevin Taylor",
      role: "Lecturer",
      specialization: "Programming Languages",
      image: "https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: "kevin.taylor@university.edu",
      website: "https://example.com",
      bio: "Programming language designer with expertise in compiler construction and language theory."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the dedicated faculty and researchers who drive innovation and excellence in computer science education. 
            Our diverse team brings together expertise from across the computing spectrum.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-muted-foreground">Faculty Members</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">8</div>
              <div className="text-muted-foreground">Research Areas</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Publications</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </CardContent>
          </Card>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-background shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {member.name}
                </CardTitle>
                <CardDescription>
                  {member.role}
                </CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  {member.specialization}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {member.bio}
                </p>
                
                {/* Contact Information */}
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${member.email}`}>
                      <Mail className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={member.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 py-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for passionate educators and researchers to join our growing department
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Mail className="mr-2 h-4 w-4" />
              View Open Positions
            </Button>
            <Button variant="outline" size="lg">
              Contact Department
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;