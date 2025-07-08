import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../Components/ui/card';
import { Button } from '../../../Components/ui/button';
import { Badge } from '../../../Components/ui/badge';
import { Skeleton } from '../../../Components/ui/skeleton';
import { ArrowLeft, MessageCircle, User, Bot, Clock, CheckCircle, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../../../Service/chat/service';
import { useToast } from '../../../Components/ui/use-toast';

interface SessionHistoryData {
  session_info: {
    session_id: string;
    topic: string;
    subtopic?: string;
    status: 'active' | 'paused' | 'completed';
  };
  concepts_covered: string[];
  session_history: Array<{
    timestamp: string;
    type: 'question' | 'answer' | 'exercise' | 'concept';
    content: string;
    metadata?: Record<string, unknown>;
  }>;
  exercises_completed: Array<{
    exercise_id: string;
    pregunta: string;
    respuesta_usuario: string;
    es_correcto: boolean;
    timestamp: string;
  }>;
  questions_asked: Array<{
    pregunta: string;
    respuesta: string;
    timestamp: string;
  }>;
}

const SessionHistoryPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<SessionHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'exercises' | 'questions'>('all');
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadHistory = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const response = await chatService.getLearningSessionHistory(sessionId);
      setHistoryData(response);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de la sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, toast]);

  useEffect(() => {
    if (sessionId) {
      loadHistory();
    }
  }, [sessionId, loadHistory]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'answer':
        return <Bot className="h-4 w-4 text-purple-600" />;
      case 'exercise':
        return <Target className="h-4 w-4 text-orange-600" />;
      case 'concept':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-50 border-blue-200';
      case 'answer':
        return 'bg-purple-50 border-purple-200';
      case 'exercise':
        return 'bg-orange-50 border-orange-200';
      case 'concept':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!historyData) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/alumno/learning-sessions/${sessionId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Historial no disponible
            </h3>
            <p className="text-gray-600 text-center">
              No se pudo cargar el historial de esta sesión
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allItems = [
    ...(historyData.session_history || []).map(item => ({ ...item, source: 'history' })),
    ...(historyData.exercises_completed || []).map(exercise => ({
      timestamp: exercise.timestamp,
      type: 'exercise',
      content: `Ejercicio: ${exercise.pregunta}`,
      metadata: { 
        respuesta: exercise.respuesta_usuario, 
        correcto: exercise.es_correcto,
        exercise_id: exercise.exercise_id 
      },
      source: 'exercise'
    })),
    ...(historyData.questions_asked || []).map(question => ({
      timestamp: question.timestamp,
      type: 'question',
      content: question.pregunta,
      metadata: { respuesta: question.respuesta },
      source: 'question'
    }))
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const filteredItems = (() => {
    switch (activeTab) {
      case 'exercises':
        return allItems.filter(item => item.source === 'exercise');
      case 'questions':
        return allItems.filter(item => item.source === 'question');
      default:
        return allItems;
    }
  })();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-900">Historial de Sesión</h1>
          <p className="text-gray-600 mt-1">
            {historyData.session_info.topic}
            {historyData.session_info.subtopic && ` - ${historyData.session_info.subtopic}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('all')}
                >
                  Todo ({allItems.length})
                </Button>
                <Button
                  variant={activeTab === 'exercises' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('exercises')}
                >
                  Ejercicios ({(historyData.exercises_completed || []).length})
                </Button>
                <Button
                  variant={activeTab === 'questions' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('questions')}
                >
                  Preguntas ({(historyData.questions_asked || []).length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay elementos para mostrar
                  </h3>
                  <p className="text-gray-600 text-center">
                    No se encontraron elementos del tipo seleccionado
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredItems.map((item, index) => (
                <Card key={index} className={`${getTypeColor(item.type)} border-l-4`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.type === 'question' ? 'Pregunta' :
                             item.type === 'answer' ? 'Respuesta' :
                             item.type === 'exercise' ? 'Ejercicio' :
                             item.type === 'concept' ? 'Concepto' : item.type}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(item.timestamp)}
                          </div>
                        </div>
                        
                        <div className="whitespace-pre-wrap text-sm text-gray-900 mb-2">
                          {item.content}
                        </div>

                        {/* Metadata específica por tipo */}
                        {item.source === 'exercise' && item.metadata && 'correcto' in item.metadata && (
                          <div className="bg-white rounded p-3 border">
                            <div className="text-xs text-gray-600 mb-1">Respuesta del usuario:</div>
                            <div className="text-sm mb-2">{item.metadata.respuesta as string}</div>
                            <Badge variant={(item.metadata.correcto as boolean) ? 'default' : 'destructive'}>
                              {(item.metadata.correcto as boolean) ? 'Correcto' : 'Incorrecto'}
                            </Badge>
                          </div>
                        )}

                        {item.source === 'question' && item.metadata && 'respuesta' in item.metadata && (
                          <div className="bg-white rounded p-3 border">
                            <div className="text-xs text-gray-600 mb-1">Respuesta del tutor:</div>
                            <div className="text-sm">{item.metadata.respuesta as string}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resumen */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
              <CardDescription>
                Estadísticas del historial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de interacciones</span>
                <span className="font-semibold">{allItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ejercicios completados</span>
                <span className="font-semibold">{(historyData.exercises_completed || []).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Preguntas realizadas</span>
                <span className="font-semibold">{(historyData.questions_asked || []).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ejercicios correctos</span>
                <span className="font-semibold text-green-600">
                  {(historyData.exercises_completed || []).filter(ex => ex.es_correcto).length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Conceptos cubiertos */}
          {historyData.concepts_covered && historyData.concepts_covered.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conceptos Cubiertos</CardTitle>
                <CardDescription>
                  Temas trabajados en esta sesión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(historyData.concepts_covered || []).map((concept, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{concept}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/alumno/learning-sessions/${sessionId}/stats`)}
              >
                Ver Estadísticas
              </Button>
              
              {historyData.session_info.status === 'active' && (
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/alumno/learning-sessions/${sessionId}/chat`)}
                >
                  Continuar Chat
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionHistoryPage;
