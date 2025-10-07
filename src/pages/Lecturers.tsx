import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Crown, Users } from 'lucide-react';
import Header from '@/components/layout/Header';

const presidentsData = [
  {
    id: 1,
    name: "Comrade Femi",
    title: "1st NACOS President",
    profileImage: "/assets/lecturer1.jpg",
    tenure: '2008/2009'
  },
  {
    id: 2,
    name: "Comrade Sodeeq Oyelakin",
    title: "2nd NACOS President",
    profileImage: "/assets/lecturer2.jpg",
    tenure: '2009/2010'
  },
  {
    id: 3,
    name: "AZ",
    title: "3rd NACOS President",
    profileImage: "/assets/lecturer3.jpg",
    tenure: '2011/2012'
  },
  {
    id: 4,
    name: "Dunamis",
    title: "4th NACOS President",
    profileImage: "/assets/lecturer4.jpg",
    tenure: '2012/2013'
  },
  {
    id: 5,
    name: "Ibile",
    title: "5th NACOS President",
    profileImage: "/assets/lecturer5.jpg",
    tenure: "2013/2014"
  },
  {
    id: 6,
    name: "Holisoft",
    title: "6th NACOS President",
    profileImage: "/assets/lecturer6.jpg",
    tenure: "2014/2015"
  },
  {
    id: 7,
    name: "Hlaw",
    title: "7th NACOS President",
    profileImage: "/assets/lecturer7.jpg",
    tenure: "2015/2016"
  },
  {
    id: 8,
    name: "Makavelli",
    title: "8th NACOS President",
    profileImage: "/assets/lecturer8.jpg",
    tenure: "2016/2017"
  },
  {
    id: 9,
    name: "Leumas",
    title: "9th NACOS President",
    profileImage: "/assets/lecturer9.jpg",
    tenure: "2017/2018"
  },
  {
    id: 10,
    name: "JP Crown",
    title: "10th NACOS President",
    profileImage: "/assets/lecturer10.jpg",
    tenure: "2018/2019"
  },
  {
    id: 11,
    name: "YSL",
    title: "11th NACOS President",
    profileImage: "/assets/lecturer11.jpg",
    tenure: "2019/2020"
  },
  {
    id: 12,
    name: "CODAK",
    title: "12th NACOS President",
    profileImage: "/assets/lecturer12.jpg",
    tenure: "2020/2021"
  },
  {
    id: 13,
    name: "PSALMIST",
    title: "13th NACOS President",
    profileImage: "/assets/lecturer13.jpg",
    tenure: "2021/2022"
  },
  {
    id: 14,
    name: "STANDARD",
    title: "14th NACOS President",
    profileImage: "/assets/lecturer14.jpg",
    tenure: "2022/2023"
  },
  {
    id: 15,
    name: "Samson",
    title: "15th NACOS President",
    profileImage: "/assets/lecturer15.jpg",
    tenure: "2023/2024"
  },
  {
    id: 16,
    name: "Code Doctor",
    title: "16th NACOS President",
    profileImage: "/assets/lecturer16.jpg",
    tenure: "2024/2025"
  },
  {
    id: 17,
    name: "DAN Sugar",
    title: "17th NACOS President",
    profileImage: "/assets/lecturer17.jpg",
    tenure: "2025/2026"
  }
];

const Lecturers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Header />

      
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        
        <div className="text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Legacy of Leadership</span>

          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            NACOS Presidents
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Celebrating the visionary leaders who have shaped our Computer Science community since 2008. 
            Each president has contributed to building a legacy of excellence, innovation and unity.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">{presidentsData.length}</div>
              <div className="text-sm text-muted-foreground">Presidents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">17+</div>
              <div className="text-sm text-muted-foreground">Years of Leadership</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">1000+</div>
              <div className="text-sm text-muted-foreground">Students Impacted</div>
            </div>
          </div>
        </div>

        {/* Presidents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {presidentsData.map((president, index) => (
            <Card 
              key={president.id} 
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="text-center pb-3 relative">
                {/* Position Badge */}
                <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold">
                  #{index + 1}
                </div>
                
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-50 group-hover:opacity-100" />
                  <img
                    src={president.profileImage}
                    alt={president.name}
                    className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-background shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.outerHTML = '<div class="w-28 h-28 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-4 border-background shadow-lg relative z-10"><svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                    }}
                  />
                </div>
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  {president.name}
                </CardTitle>
                <CardDescription className="text-sm font-medium relative z-10">
                  {president.title}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center pb-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 group-hover:bg-primary/10 rounded-lg transition-colors duration-300">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{president.tenure}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-12 text-center border-2 border-primary/20">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full mb-6">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Join the Legacy</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">Be Part of Our Story</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Interested in learning more about NACOS or contributing to our vibrant community? 
              We're always looking for passionate individuals to join our ranks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Users className="mr-2 h-5 w-5" />
                Join NACOS
              </Button>
              <Button variant="outline" size="lg" className="font-semibold border-2 hover:border-primary transition-all duration-300">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecturers;