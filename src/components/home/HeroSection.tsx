
import { Brain, Mic, Sparkles, ArrowRight, Users, Lightbulb, Zap, LogIn, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative py-14 md:py-20 overflow-hidden">
      {/* Dynamic background with animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/10 animate-gradient-slow" />
      
      {/* Floating shapes for visual interest */}
      <div className="absolute hidden md:block -top-10 right-1/4 w-56 h-56 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute hidden md:block bottom-10 left-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-center relative">
          {/* Left side: Content */}
          <div className="space-y-5 md:space-y-7 animate-fade-in">
            {/* App name with improved styling */}
            <div className="inline-flex items-center space-x-2.5 bg-background/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
              <span className="font-medium text-sm md:text-[0.9rem]">IA Helper</span>
            </div>
            
            {/* Main heading with dynamic gradient */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Your Personal
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Academic Assistant
              </span>
            </h1>
            
            {/* Subheading with improved copy */}
            <p className="text-base md:text-lg text-foreground/80 max-w-lg">
              Unlock your academic potential with AI-powered learning tools and resource sharing.
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-2.5 md:gap-3.5">
              {[
                { icon: Zap, text: "Instant Answers" },
                { icon: Users, text: "Collaborative Learning" },
                { icon: Lightbulb, text: "Smart Insights" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1.5 rounded-full text-xs">
                  <item.icon className="h-3 w-3" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            
            {/* CTA buttons with enhanced styling */}
            <div className="flex flex-wrap gap-3.5">
              {user ? (
                <Link to="/chat">
                  <Button size="lg" className="gap-2 px-7 py-5 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Learning <ArrowRight className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="gap-2 px-7 py-5 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign In <LogIn className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              )}
              {user && (
                <Link to="/materials">
                  <Button size="lg" variant="outline" className="gap-2 px-7 py-5 text-base border-primary/30 hover:bg-primary/10 shadow hover:shadow-md transition-all duration-300">
                    Explore Materials <BookOpen className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Right side: Visual element */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-sm aspect-square">
              {/* Central circle with glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-purple-500/20 to-transparent flex items-center justify-center animate-pulse-slow">
                <div className="absolute w-4/5 h-4/5 rounded-full bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-400/10 blur-xl" />
                <div className="relative w-3/5 h-3/5 rounded-full bg-background/80 backdrop-blur-md shadow-xl flex items-center justify-center border border-white/20">
                  <Brain className="w-14 h-14 text-primary" />
                </div>
              </div>
              
              {/* Orbiting elements */}
              {[
                { icon: BookOpen, delay: "0s", position: "top" },
                { icon: Users, delay: "1s", position: "right" },
                { icon: Mic, delay: "2s", position: "bottom" },
                { icon: Sparkles, delay: "3s", position: "left" },
              ].map((item, index) => {
                const positionClasses = {
                  top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  right: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
                  bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                  left: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
                }[item.position];
                
                return (
                  <div 
                    key={index}
                    className={`absolute ${positionClasses} animate-float`}
                    style={{ animationDelay: item.delay }}
                  >
                    <div className="w-11 h-11 rounded-full bg-background shadow-lg flex items-center justify-center border border-primary/20">
                      <item.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
