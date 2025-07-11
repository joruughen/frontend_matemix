import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatService } from '../Service/chat/service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string; 
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (message: string) => void;
  isOpen: boolean;
  toggleChat: () => void;
  isLoading: boolean;
  conversations: Conversation[];
  currentConversation: string | null;
  selectConversation: (id: string | null) => Promise<void>;
  createNewConversation: () => void;
  loadConversations: () => Promise<void>;
  areConversationsLoaded: boolean;
  setCurrentConversation: React.Dispatch<React.SetStateAction<string | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const conversationIdRef = useRef<string | null>(null); 
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [areConversationsLoaded, setAreConversationsLoaded] = useState(false);
    const userId = localStorage.getItem('userId_matemix') || 'default_user';
  const loadConversations = async () => {
    if (areConversationsLoaded) return;
    
    try {
      setIsLoading(true);
      const response = await chatService.getAllConversations(userId);
      console.log('Fetching conversations:', response);
      console.log('Conversations loaded:', response);
      setConversations(response || []);
      setAreConversationsLoaded(true);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const selectConversation = async (id: string | null) => {
    setCurrentConversation(id);
    setMessages([]);
    
    if (id) {
      try {
        setIsLoading(true);
        const response = await chatService.getConversationById(userId, id);
        console.log('Fetching conversation:', response);
        console.log('Conversation loaded:', response);
        setMessages(response.messages || []);
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };  
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
    const response = await fetch('http://52.206.13.161:8030/chat-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    user_id: localStorage.getItem('userId_matemix') || 'default_user',
    conversation_id: conversationIdRef.current, 
    message,
    }),
    });

    if (!response.body) throw new Error('No stream');

    const reader = response.body.getReader();
    let assistantMsg = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    let newConversationCreated = false;

    while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    chunk.split('\n').forEach(line => {
    if (line.startsWith('data:')) {
        const data = JSON.parse(line.replace('data:', '').trim());
        assistantMsg += data.text;

        if (data.conversation_id && !conversationIdRef.current) {
        conversationIdRef.current = data.conversation_id;
        newConversationCreated = true;
        }

        setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: assistantMsg }];
        }
        return prev;
        });
    }
    });
    }

    if (newConversationCreated) {
    setAreConversationsLoaded(false);
    await loadConversations();
    }
    } catch (e) {
    console.log('Error al enviar el mensaje:', e);
    } finally {
    setIsLoading(false);
    }
    };


  const createNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const userId = localStorage.getItem('userId_matemix') || 'default_user';
      await chatService.deleteConversation(userId, conversationId);
      
      // Actualizar la lista local de conversaciones
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // Si estamos viendo la conversación que se eliminó, limpiar el chat
      if (currentConversation === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error al eliminar conversación:', error);
      throw error;
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);


  useEffect(() => {
    if (!isOpen) {
      conversationIdRef.current = null;
      setMessages([]);
    }
  }, [isOpen]);

 return (
  <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      isOpen, 
      toggleChat, 
      isLoading,
      conversations,
      currentConversation,
      selectConversation,
      createNewConversation,
      loadConversations,
      areConversationsLoaded,
      setCurrentConversation, 
      setMessages,
      deleteConversation             
      }}>
    {children}
  </ChatContext.Provider>
);
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
