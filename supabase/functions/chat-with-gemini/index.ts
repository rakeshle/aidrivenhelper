
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, subject_id, document_context, language } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Processing chat message:', { subject_id, document_context, language });
    
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Make sure to use the correct model name
    // For free tier, "gemini-1.5-flash" is recommended
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create chat history context with language preference
    let prompt = "You are a helpful AI assistant. ";
    
    if (subject_id) {
      prompt += "Focus on providing information related to the selected subject. ";
    }
    
    // Add language instruction if specified
    if (language && language !== 'en') {
      prompt += `Please respond in ${language} language. `;
    }

    // Combine the prompt with the user message
    const chatResponse = await model.generateContent(prompt + message);
    const response = await chatResponse.response;
    const text = response.text();

    console.log('Generated response successfully');

    return new Response(
      JSON.stringify({ response: text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
