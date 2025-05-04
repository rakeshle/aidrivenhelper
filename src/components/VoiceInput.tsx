
import { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the expected interface for the component props
interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInput = ({ onTranscript }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setError(null);
    
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        setError('Speech recognition is not supported in this browser.');
        return;
      }
      
      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        stopListening();
      };
      
      recognition.onerror = (event: any) => {
        setError(`Error occurred: ${event.error}`);
        stopListening();
      };
      
      recognition.onend = () => {
        stopListening();
      };
      
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error('Speech recognition error:', err);
      setError('Failed to start speech recognition.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={toggleListening}
        className={isListening ? 'bg-red-100' : ''}
        title={isListening ? 'Stop listening' : 'Start voice input'}
        type="button"
      >
        {isListening ? (
          <StopCircle className="h-5 w-5 text-red-500" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {error && (
        <div className="text-sm text-red-500 flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
