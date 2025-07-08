import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../Components/ui/card';
import { Button } from '../../../Components/ui/button';
import { Badge } from '../../../Components/ui/badge';
import { Progress } from '../../../Components/ui/progress';
import { Skeleton } from '../../../Components/ui/skeleton';
import { ArrowLeft, TrendingUp, Clock, Target, MessageCircle, CheckCircle, Trophy, BarChart3, BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../../../Service/chat/service';
import { useToast } from '../../../Components/ui/use-toast';

interface SessionStatsData {
  session_id: string;
  topic: string;
  subtopic?: string;
  concepts_learned: number;
  concepts_list: string[];
  total_exercises: number;
  correct_exercises: number;
  accuracy_percentage: number;
  free_questions_asked: number;
  total_study_time_minutes: number;
  status: 'active' | 'paused' | 'completed';
  last_accessed: string;
}

const SessionStatsPage: React.FC = () => {
  const [stats, setStats] = useState<SessionStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadStats = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const response = await chatService.getLearningSessionStats(sessionId);
      setStats(response);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, toast]);

  useEffect(() => {
    if (sessionId) {
      loadStats();
    }
  }, [sessionId, loadStats]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAccuracyColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
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

  if (!stats) {
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
            <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Estadísticas no disponibles
            </h3>
            <p className="text-gray-600 text-center">
              No se pudieron cargar las estadísticas de esta sesión
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas de Sesión</h1>
          <p className="text-gray-600 mt-1">
            {stats.topic} {stats.subtopic && `- ${stats.subtopic}`}
          </p>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.total_study_time_minutes)}</div>
            <p className="text-xs text-muted-foreground">
              Tiempo total invertido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conceptos Aprendidos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.concepts_learned}</div>
            <p className="text-xs text-muted-foreground">
              Nuevos conceptos dominados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejercicios</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.correct_exercises}/{stats.total_exercises}
            </div>
            <p className="text-xs text-muted-foreground">
              Ejercicios completados correctamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisión</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAccuracyColor(stats.accuracy_percentage)}`}>
              {Math.round(stats.accuracy_percentage)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Porcentaje de aciertos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendimiento en ejercicios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rendimiento en Ejercicios
            </CardTitle>
            <CardDescription>
              Análisis detallado de tu desempeño
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barra de progreso de precisión */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Precisión General</span>
                <span className={`text-sm font-semibold ${getAccuracyColor(stats.accuracy_percentage)}`}>
                  {Math.round(stats.accuracy_percentage)}%
                </span>
              </div>
              <Progress 
                value={stats.accuracy_percentage} 
                className="h-3"
              />
              <div className={`mt-2 px-3 py-2 rounded-lg ${getAccuracyBgColor(stats.accuracy_percentage)}`}>
                <p className={`text-sm ${getAccuracyColor(stats.accuracy_percentage)}`}>
                  {stats.accuracy_percentage >= 80 
                    ? '¡Excelente trabajo! Tu precisión es muy alta.'
                    : stats.accuracy_percentage >= 60
                    ? 'Buen progreso. Sigue practicando para mejorar.'
                    : 'Hay espacio para mejorar. Considera repasar los conceptos.'}
                </p>
              </div>
            </div>

            {/* Estadísticas detalladas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{stats.total_exercises}</div>
                <div className="text-xs text-blue-600">Ejercicios Totales</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{stats.correct_exercises}</div>
                <div className="text-xs text-green-600">Ejercicios Correctos</div>
              </div>
            </div>

            {/* Preguntas libres */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-sm">Preguntas Realizadas</div>
                  <div className="text-xs text-gray-600">Interacciones con el tutor</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.free_questions_asked}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conceptos aprendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Conceptos Dominados
            </CardTitle>
            <CardDescription>
              Lista de conceptos que has aprendido en esta sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.concepts_list && stats.concepts_list.length > 0 ? (
              <div className="space-y-3">
                {stats.concepts_list.map((concept, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-green-900">{concept}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay conceptos registrados
                </h3>
                <p className="text-gray-600 text-sm">
                  Los conceptos se registrarán a medida que avances en la sesión
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información de la sesión */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Sesión</CardTitle>
          <CardDescription>
            Detalles y estado actual de tu sesión de aprendizaje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Estado</div>
              <Badge variant={stats.status === 'active' ? 'default' : stats.status === 'completed' ? 'secondary' : 'outline'}>
                {stats.status === 'active' ? 'Activa' : stats.status === 'completed' ? 'Completada' : 'Pausada'}
              </Badge>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Último Acceso</div>
              <div className="text-sm text-gray-600">
                {new Date(stats.last_accessed).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">ID de Sesión</div>
              <div className="text-sm text-gray-600 font-mono">
                {stats.session_id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex gap-4">
        <Button 
          onClick={() => navigate(`/alumno/learning-sessions/${sessionId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la Sesión
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/alumno/learning-sessions/${sessionId}/history`)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Ver Historial
        </Button>

        {stats.status === 'active' && (
          <Button 
            variant="outline"
            onClick={() => navigate(`/alumno/learning-sessions/${sessionId}/chat`)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Continuar Chat
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionStatsPage;
