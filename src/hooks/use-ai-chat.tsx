import { useState, useCallback } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };
type AiContext = 'assistant' | 'dashboard' | 'crm' | 'orcamento';

// AI Chat desabilitado - dependia do Supabase Cloud
// Para reabilitar, configure um endpoint de chat (OpenAI, MiniMax, etc)

export function useAiChat(context: AiContext = 'assistant') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    // Simular resposta do AI ( placeholder - desabilitado )
    setTimeout(() => {
      const response: Message = {
        role: 'assistant',
        content:
          '🤖 AI Chat temporariamente desabilitado. Configure um provedor de chat para reabilitar (OpenAI, MiniMax, etc).',
      };
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 500);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}

export async function aiOneShot(context: AiContext, userMessage: string): Promise<string> {
  // Placeholder - AI desabilitado
  return '🤖 AI Chat temporariamente desabilitado. Configure um provedor de chat para reabilitar.';
}
