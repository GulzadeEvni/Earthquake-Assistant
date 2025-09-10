import { useState } from 'react';
import { sendToAI } from '../utils/ai';
import { formatAIResponse } from '../utils/prompts';

interface UseAIRequestReturn {
  loading: boolean;
  response: string | null;
  error: string | null;
  makeRequest: (question: string, systemPrompt: string) => Promise<string | null>;
  reset: () => void;
}

export const useAIRequest = (): UseAIRequestReturn => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async (question: string, systemPrompt: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const aiResponse = await sendToAI(question, systemPrompt);
      const formattedResponse = formatAIResponse(aiResponse);
      setResponse(formattedResponse);
      return formattedResponse;
    } catch (err) {
      const errorMsg = "❌ Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      setError(errorMsg);
      setResponse(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResponse(null);
    setError(null);
  };

  return { loading, response, error, makeRequest, reset };
};