
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Mic, FileText, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get instant help with research, explanations, and academic questions.",
      demo: "Ask me anything about your studies!",
      color: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    },
    {
      icon: Mic,
      title: "Voice Input",
      description: "Natural voice interactions for seamless communication.",
      demo: "Click the microphone to start speaking.",
      color: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    },
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Upload study materials.",
      demo: "Upload your documents to share with others.",
      color: "from-emerald-600 to-green-600",
      bgGradient: "from-emerald-500/10 via-green-500/5 to-transparent",
    },
    {
      icon: Sparkles,
      title: "Multi-Subject Support",
      description: "Comprehensive knowledge across academic disciplines.",
      demo: "Explore various subjects with expert guidance.",
      color: "from-amber-600 to-orange-600",
      bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    },
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent inline-block">
            Experience Our Features
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Discover the tools that make learning more efficient and enjoyable
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg border overflow-hidden",
                  activeFeature === index 
                    ? "border-primary/50 shadow-lg shadow-primary/10" 
                    : "border-border hover:border-primary/30"
                )}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-full",
                      "bg-gradient-to-br",
                      activeFeature === index 
                        ? `${features[activeFeature].bgGradient}` 
                        : "bg-muted/50"
                    )}>
                      <feature.icon className={cn(
                        "h-6 w-6",
                        activeFeature === index 
                          ? `bg-gradient-to-br ${features[activeFeature].color} bg-clip-text text-transparent` 
                          : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-semibold transition-colors",
                        activeFeature === index 
                          ? `bg-gradient-to-br ${features[activeFeature].color} bg-clip-text text-transparent` 
                          : ""
                      )}>{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <ArrowRight className={cn(
                      "ml-auto h-5 w-5 transition-transform text-muted-foreground",
                      activeFeature === index ? "rotate-90 text-primary" : ""
                    )} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="overflow-hidden border-none shadow-xl">
            <div className={cn(
              "h-[400px] flex items-center justify-center p-8",
              "bg-gradient-to-br", 
              features[activeFeature].bgGradient
            )}>
              <div className="text-center max-w-md mx-auto">
                <div className="p-6 bg-background/70 backdrop-blur-sm rounded-full inline-block mb-6 shadow-lg">
                  {React.createElement(features[activeFeature].icon, { 
                    className: `h-12 w-12 bg-gradient-to-br ${features[activeFeature].color} bg-clip-text text-transparent` 
                  })}
                </div>
                
                <h3 className={cn(
                  "text-2xl font-bold mb-3 bg-gradient-to-br bg-clip-text text-transparent",
                  features[activeFeature].color
                )}>
                  {features[activeFeature].title}
                </h3>
                
                <p className="text-muted-foreground mb-6 text-lg">
                  {features[activeFeature].demo}
                </p>
                
               {/** <Button 
                  className={cn(
                    "bg-gradient-to-r shadow-lg hover:shadow-xl transition-all",
                    features[activeFeature].color
                  )}
                >
                  Try it now
                </Button>**/}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FeatureShowcase
