import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '../../../Components/ui/card';
import { Button } from '../../../Components/ui/button';
import { Input } from '../../../Components/ui/input';
import { Badge } from '../../../Components/ui/badge';
import { Skeleton } from '../../../Components/ui/skeleton';
import { ArrowLeft, Send, MessageCircle, User, Bot, Clock, BookOpen, Pause, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../../../Service/chat/service';
import type { LearningSession } from '../../../Types/LearningSession/types';
import { useToast } from '../../../Components/ui/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SessionChatPage: React.FC = () => {
  const [session, setSession] = useState<LearningSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const user_id = localStorage.getItem('userId_matemix') || 'default_user';
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessionData = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const [sessionResponse, historyResponse] = await Promise.all([
        chatService.getLearningSession(sessionId),
        chatService.getLearningSessionConversationHistory(sessionId)
      ]);
      
      setSession(sessionResponse);
      setMessages(historyResponse.messages || []);
      console.log('Session data loaded:', sessionResponse, historyResponse);
    } catch (error) {
      console.error('Error loading session data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, toast]);

  useEffect(() => {
    if (sessionId && user_id) {
      loadSessionData();
    }
  }, [sessionId, user_id, loadSessionData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || !sessionId || sending) return;

    const messageToSend = currentMessage;
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setSending(true);

    try {
      const response = await fetch(`http://52.206.13.161:8030/learning/session/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: messageToSend,
          user_id: user_id
        }),
      });

      if (!response.body) throw new Error('No stream available');

      const reader = response.body.getReader();
      let assistantMessage = '';
      
      // Add empty assistant message to start
      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        
        // Split by lines and process each line
        chunk.split('\n').forEach(line => {
          if (line.startsWith('data:')) {
            try {
              const data = JSON.parse(line.replace('data:', '').trim());
              
              if (data.text) {
                assistantMessage += data.text;
                
                // Update the last assistant message
                setMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    return [...prev.slice(0, -1), { 
                      role: 'assistant', 
                      content: assistantMessage,
                      timestamp: new Date().toISOString()
                    }];
                  }
                  return prev;
                });
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        });
      }

    } catch (error) {
      console.error('Error with chat stream:', error);
      // Fallback to regular API call if streaming fails
      await fallbackToRegularChat(messageToSend);
    } finally {
      setSending(false);
    }
  };

  const fallbackToRegularChat = async (messageToSend: string) => {
    if (!sessionId || !user_id) return;

    try {
      const response = await chatService.chatInLearningSession({
        session_id: sessionId,
        message: messageToSend,
        user_id: user_id
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response || response.text || 'Lo siento, no pude procesar tu mensaje.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSessionAction = async (action: 'pause' | 'complete') => {
    if (!sessionId) return;

    try {
      setActionLoading(action);
      
      if (action === 'pause') {
        await chatService.pauseLearningSession(sessionId);
        toast({
          title: "Sesión pausada",
          description: "Puedes continuar más tarde desde donde lo dejaste",
        });
        navigate(`/alumno/learning-sessions/${sessionId}`);
      } else {
        await chatService.completeLearningSession(sessionId);
        toast({
          title: "Sesión completada",
          description: "¡Felicidades por completar tu sesión de aprendizaje!",
        });
        navigate(`/alumno/learning-sessions/${sessionId}`);
      }
    } catch (error) {
      console.error(`Error ${action} session:`, error);
      toast({
        title: "Error",
        description: `No se pudo ${action === 'pause' ? 'pausar' : 'completar'} la sesión`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'paused':
        return 'Pausada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b bg-white p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Skeleton className="h-16 w-3/4 max-w-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sesión no encontrada
            </h3>
            <p className="text-gray-600 text-center mb-4">
              No se pudo encontrar la sesión solicitada
            </p>
            <Button onClick={() => navigate('/alumno/learning-sessions')}>
              Volver a Sesiones
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session.status !== 'active') {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sesión no activa
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Esta sesión está {session.status === 'paused' ? 'pausada' : 'completada'}. 
              {session.status === 'paused' ? ' Reactivala para continuar el chat.' : ''}
            </p>
            <Button onClick={() => navigate(`/alumno/learning-sessions/${sessionId}`)}>
              Ver Detalles de Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/alumno/learning-sessions/${sessionId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{session.topic}</h1>
              {session.subtopic && (
                <p className="text-sm text-gray-600">{session.subtopic}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(session.status)}>
              {getStatusText(session.status)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSessionAction('pause')}
              disabled={actionLoading === 'pause'}
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              {actionLoading === 'pause' ? 'Pausando...' : 'Pausar'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSessionAction('complete')}
              disabled={actionLoading === 'complete'}
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4" />
              {actionLoading === 'complete' ? 'Completando...' : 'Completar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Hola! Soy tu tutor de {session.topic}
            </h3>
            <p className="text-gray-600 max-w-md">
              Estoy aquí para ayudarte a aprender. Puedes preguntarme cualquier cosa sobre {session.topic}
              {session.subtopic && `, especialmente sobre ${session.subtopic}`}.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <Bot className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User className="h-6 w-6 text-white mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-2 flex items-center gap-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border shadow-sm rounded-lg p-4 max-w-xs">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={sending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!currentMessage.trim() || sending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SessionChatPage;
