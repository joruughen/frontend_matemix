import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../Components/ui/card';
import { Button } from '../../../Components/ui/button';
import { Badge } from '../../../Components/ui/badge';
import { Skeleton } from '../../../Components/ui/skeleton';
import { ArrowLeft, MessageCircle, BarChart3, History, Download, Play, Pause, CheckCircle, Clock, BookOpen, Target, Trophy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../../../Service/chat/service';
import type { LearningSession, LearningSessionStats } from '../../../Types/LearningSession/types';
import { useToast } from '../../../Components/ui/use-toast';

const LearningSessionDetailPage: React.FC = () => {
  const [session, setSession] = useState<LearningSession | null>(null);
  const [stats, setStats] = useState<LearningSessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const user_id = localStorage.getItem('userId_matemix') || 'default_user';
  const { toast } = useToast();

  const loadSessionData = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const [sessionResponse, statsResponse] = await Promise.all([
        chatService.getLearningSession(sessionId),
        chatService.getLearningSessionStats(sessionId)
      ]);
      
      setSession(sessionResponse);
      setStats(statsResponse);
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

  const handleSessionAction = async (action: 'pause' | 'reactivate' | 'complete') => {
    if (!sessionId) return;

    try {
      setActionLoading(action);
      
      switch (action) {
        case 'pause':
          await chatService.pauseLearningSession(sessionId);
          break;
        case 'reactivate':
          await chatService.reactivateLearningSession(sessionId);
          break;
        case 'complete':
          await chatService.completeLearningSession(sessionId);
          break;
      }

      await loadSessionData();
      
      toast({
        title: "Acción completada",
        description: `La sesión ha sido ${action === 'pause' ? 'pausada' : action === 'reactivate' ? 'reactivada' : 'completada'} exitosamente`,
      });
    } catch (error) {
      console.error(`Error ${action} session:`, error);
      toast({
        title: "Error",
        description: `No se pudo ${action === 'pause' ? 'pausar' : action === 'reactivate' ? 'reactivar' : 'completar'} la sesión`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const downloadReport = async (type: 'report' | 'exercises') => {
    if (!sessionId) return;

    try {
      let blob;
      if (type === 'report') {
        blob = await chatService.downloadSessionPDFReport(sessionId);
      } else {
        blob = await chatService.downloadSessionPDFExercises(sessionId);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `sesion-${sessionId}-${type}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Descarga iniciada",
        description: "El reporte se está descargando",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el reporte",
        variant: "destructive",
      });
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basico':
        return 'bg-green-100 text-green-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
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
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/alumno/learning-sessions')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sesión no encontrada
            </h3>
            <p className="text-gray-600 text-center">
              No se pudo encontrar la sesión solicitada
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/alumno/learning-sessions')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{session.topic}</h1>
            {session.subtopic && (
              <p className="text-gray-600 mt-1">{session.subtopic}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(session.status)}>
            {getStatusText(session.status)}
          </Badge>
          <Badge variant="outline" className={getLevelColor(session.level)}>
            {session.level}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información de la Sesión</CardTitle>
            <CardDescription>
              Detalles y progreso de tu sesión de aprendizaje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estadísticas */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{stats.total_messages}</div>
                  <div className="text-xs text-blue-600">Mensajes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{formatDuration(stats.duration_minutes)}</div>
                  <div className="text-xs text-green-600">Tiempo</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">{stats.exercises_completed}</div>
                  <div className="text-xs text-purple-600">Ejercicios</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Trophy className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900">{Math.round(stats.success_rate * 100)}%</div>
                  <div className="text-xs text-orange-600">Aciertos</div>
                </div>
              </div>
            )}

            {/* Conceptos Cubiertos */}
            {stats && stats.concepts_covered && stats.concepts_covered.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Conceptos Cubiertos</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.concepts_covered.map((concept, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Objetivos Cumplidos */}
            {stats && stats.learning_objectives_met && stats.learning_objectives_met.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Objetivos Cumplidos</h3>
                <div className="space-y-2">
                  {stats.learning_objectives_met.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm font-medium text-gray-900">Iniciada</div>
                <div className="text-sm text-gray-600">
                  {new Date(session.created_at).toLocaleString()}
                </div>
              </div>
              {session.completed_at && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Completada</div>
                  <div className="text-sm text-gray-600">
                    {new Date(session.completed_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>
              Gestiona tu sesión de aprendizaje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Chat */}
            {session.status === 'active' && (
              <Button 
                onClick={() => navigate(`/alumno/learning-sessions/${sessionId}/chat`)}
                className="w-full flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Continuar Chat
              </Button>
            )}

            {/* Historial */}
            <Button 
              variant="outline"
              onClick={() => navigate(`/alumno/learning-sessions/${sessionId}/history`)}
              className="w-full flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Ver Historial
            </Button>

            {/* Estadísticas */}
            <Button 
              variant="outline"
              onClick={() => navigate(`/alumno/learning-sessions/${sessionId}/stats`)}
              className="w-full flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Estadísticas Detalladas
            </Button>

            {/* Acciones de Estado */}
            {session.status === 'active' && (
              <Button 
                variant="outline"
                onClick={() => handleSessionAction('pause')}
                disabled={actionLoading === 'pause'}
                className="w-full flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                {actionLoading === 'pause' ? 'Pausando...' : 'Pausar Sesión'}
              </Button>
            )}

            {session.status === 'paused' && (
              <Button 
                onClick={() => handleSessionAction('reactivate')}
                disabled={actionLoading === 'reactivate'}
                className="w-full flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {actionLoading === 'reactivate' ? 'Reactivando...' : 'Reactivar Sesión'}
              </Button>
            )}

            {(session.status === 'active' || session.status === 'paused') && (
              <Button 
                variant="outline"
                onClick={() => handleSessionAction('complete')}
                disabled={actionLoading === 'complete'}
                className="w-full flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4" />
                {actionLoading === 'complete' ? 'Completando...' : 'Completar Sesión'}
              </Button>
            )}

            {/* Descargas */}
            {session.status === 'completed' && (
              <>
                <div className="border-t pt-3">
                  <div className="text-sm font-medium text-gray-900 mb-2">Reportes</div>
                  <Button 
                    variant="outline"
                    onClick={() => downloadReport('report')}
                    className="w-full flex items-center gap-2 mb-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Reporte
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => downloadReport('exercises')}
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Ejercicios
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningSessionDetailPage;
