
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, BookOpen,Brain, Mic, Sparkles } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const WelcomeCard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user profile to display name instead of email
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!error && data) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchProfile();
    }
  }, [user]);

  // Determine display name - use full_name if available, otherwise email
  const displayName = profile?.full_name ? profile.full_name : user?.email;

  const features = [
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get help with research, explanations, and academic questions",
    },
    {
      icon: BookOpen,
      title: "Learning Materials",
      description: "Share and access study resources created by fellow students",
    },
   
    {
      icon: Sparkles,
      title: "Multi-Language Support",
      description: "Chat with the AI in multiple languages",
    }
  ];

  if (!user) return null;

  return (
    <section className="container mx-auto px-4">
      <Card className="glass-card mx-auto max-w-3xl overflow-hidden border-t-4 border-t-primary transform hover:scale-[1.01] transition-transform duration-300">
        <CardContent className="p-5 md:p-7">
          <div className="flex items-center gap-2.5 mb-3.5">
            <Star className="h-6 w-6 text-primary animate-pulse" />
            <h2 className="text-xl md:text-2xl font-bold">
              Welcome, {displayName || 'User'}
            </h2>
          </div>
          
          <p className="mb-5 text-foreground/80 text-base">
            Experience the power of AI-driven academic support and collaborate with fellow students. Start exploring our features today.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-3.5 rounded-xl bg-gradient-to-br from-muted/50 to-muted hover:from-primary/5 hover:to-primary/10 transition-colors duration-300"
              >
                <div className="flex flex-col items-center text-center gap-2.5">
                  <div className="p-1.5 bg-primary/10 rounded-full">
                    <feature.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-foreground/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WelcomeCard;
