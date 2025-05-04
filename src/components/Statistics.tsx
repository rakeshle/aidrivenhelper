
import { Card, CardContent } from "@/components/ui/card"
import { Brain, MessageSquare, FileText, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const Statistics = () => {
  const stats = [
    {
      icon: Brain,
      value: "500+",
      label: "Daily Conversations",
      description: "Active chat sessions with our AI",
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: MessageSquare,
      value: "98%",
      label: "Accuracy Rate",
      description: "In academic responses",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      icon: FileText,
      value: "1000+",
      label: "Documents Analyzed",
      description: "Academic papers processed",
      color: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-500",
    },
    {
      icon: Users,
      value: "5000+",
      label: "Active Users",
      description: "Students using our platform",
      color: "from-orange-500/20 to-amber-500/20",
      iconColor: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-5"> {/* Reduced from space-y-6 */}
      <div className="text-center mb-7"> {/* Reduced from mb-8 */}
        <h2 className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent inline-block"> {/* Reduced from text-3xl */}
          Empowering Your Learning Journey
        </h2>
        <p className="text-muted-foreground mt-1.5 max-w-2xl mx-auto text-[0.9rem]"> {/* Reduced from mt-2 and text size */}
          See how our platform is transforming academic assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"> {/* Reduced from gap-6 */}
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={cn(
              "overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]", /* Reduced shadow and hover effect */
              "bg-gradient-to-br", stat.color
            )}
          >
            <CardContent className="p-5"> {/* Reduced from p-6 */}
              <div className="flex flex-col items-center text-center space-y-3.5"> {/* Reduced from space-y-4 */}
                <div className="p-2.5 bg-background/70 backdrop-blur-sm rounded-full shadow-inner"> {/* Reduced from p-3 */}
                  <stat.icon className={cn("h-7 w-7", stat.iconColor)} /> {/* Reduced from h-8 w-8 */}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div> {/* Reduced from text-3xl */}
                  <div className="font-medium text-[0.9rem]"> {/* Reduced text size */}
                    {stat.label}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground"> {/* Reduced from text-sm */}
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Statistics
