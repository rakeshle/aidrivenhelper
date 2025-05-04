
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the AI assistant help with my studies?",
      answer: "Our AI assistant is designed to provide instant academic support. It can explain complex concepts, help with research questions, provide examples, and assist with problem-solving across various subjects. The assistant adapts to your learning style and provides personalized explanations."
    },
    {
      question: "Can I upload my lecture notes for better context?",
      answer: "Yes! You can upload lecture notes, textbook pages, or assignment questions. Our AI will analyze these documents and provide context-aware responses that are specifically tailored to your course materials, making the assistance more relevant to your studies."
    },
    {
      question: "Is my academic data kept private?",
      answer: "Absolutely. We take data privacy very seriously. All your conversations with the AI, uploaded documents, and personal information are securely stored and never shared with third parties. You have full control over what you share and with whom within the platform."
    },
    {
      question: "Can I use the platform in languages other than English?",
      answer: "Yes, our platform supports multiple languages. You can interact with the AI assistant in your preferred language, and it will respond accordingly. This feature helps make academic assistance more accessible to non-native English speakers."
    }
  ];

  return (
    <section className="py-14 relative overflow-hidden"> {/* Reduced from py-16 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10"> {/* Reduced from mb-12 */}
          <h2 className="text-3xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent inline-block"> {/* Reduced from text-4xl */}
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2.5 max-w-2xl mx-auto text-[0.9rem]"> {/* Reduced from mt-3 and text size */}
            Find answers to common questions about our academic assistance platform
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto"> {/* Reduced from max-w-3xl */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-muted">
                <AccordionTrigger className="text-left font-medium text-base py-5 hover:text-primary transition-colors"> {/* Reduced from text-lg py-6 */}
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-[0.9rem]"> {/* Reduced from pb-6 and text size */}
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
