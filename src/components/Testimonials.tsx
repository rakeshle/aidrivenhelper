
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const Testimonials = () => {
  const testimonials = [
    {
      name: "Odhiambo Dennis",
      role: "Computer Science Student",
      image: null,
      quote: "This AI assistant has significantly improved my understanding of complex programming concepts. The explanations are clear and tailored to my learning style.",
      rating: 5,
      color: "from-blue-500/10 to-indigo-500/10",
    },
    {
      name: "Evance Kyalo",
      role: "Engineering Major",
      image: null,
      quote: "The voice input feature makes it so easy to get quick answers during study sessions. It's like having a professor available 24/7 to help with challenging topics.",
      rating: 5,
      color: "from-purple-500/10 to-pink-500/10",
    },
    {
      name: "Ongonga Quinter",
      role: "Mathematics Student",
      image: null,
      quote: "Having access to contextual learning with document upload has transformed how I approach problem-solving. I can now tackle complex equations with confidence.",
      rating: 4,
      color: "from-amber-500/10 to-orange-500/10",
    }
  ]

  return (
    <div className="space-y-7">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent inline-block">
          What Our Users Say
        </h2>
        <p className="text-muted-foreground mt-1.5 max-w-2xl mx-auto text-[0.9rem]">
          Hear from students who have transformed their learning experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {testimonials.map((testimonial, index) => (
          <Card 
            key={index} 
            className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-md border-none",
              "bg-gradient-to-br", testimonial.color
            )}
          >
            <CardContent className="p-7 relative">
              <Quote className="absolute top-3.5 right-3.5 h-7 w-7 text-primary/20" />
              
              <div className="mb-5 flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-3.5 w-3.5 mr-1",
                      i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                    )} 
                  />
                ))}
              </div>
              
              <p className="mb-5 text-foreground/90 italic text-[0.9rem]">{testimonial.quote}</p>
              
              <div className="flex items-center">
                <Avatar className="h-11 w-11 border-2 border-background">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3.5">
                  <div className="font-semibold text-[0.9rem]">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
