
import { Github, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-background border-t mt-auto">
      <div className="container mx-auto flex flex-col gap-4 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-lg font-semibold">IA Helper</h3>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              AI-Driven Academic Assistant - Powered by Innovation and Knowledge
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IA Helper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
