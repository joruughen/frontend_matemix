import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../Components/ui/card';
import { Button } from '../../../Components/ui/button';
import { Badge } from '../../../Components/ui/badge';
import { Skeleton } from '../../../Components/ui/skeleton';
import { Plus, BookOpen, Clock, Trophy, Pause, Play, CheckCircle, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../../Service/chat/service';
import type { LearningSession } from '../../../Types/LearningSession/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../Components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../Components/ui/alert-dialog';

const LearningSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [activeSessions, setActiveSessions] = useState<LearningSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const user_id = localStorage.getItem('userId_matemix') || 'default_user';

  const loadSessions = useCallback(async () => {
    if (!user_id) return;

    try {
      setLoading(true);
      const [allSessionsResponse, activeSessionsResponse] = await Promise.all([
        chatService.getUserLearningSessions(user_id),
        chatService.getActiveLearningSessions(user_id)
      ]);
      
      setSessions(allSessionsResponse.sessions || []);
      setActiveSessions(activeSessionsResponse.sessions || []);
      console.log('All sessions loaded:', allSessionsResponse);
      console.log('Active sessions loaded:', activeSessionsResponse);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    if (user_id) {
      loadSessions();
    }
  }, [user_id, loadSessions]);

  const handlePauseSession = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      await chatService.pauseLearningSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Error pausing session:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateSession = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      await chatService.reactivateLearningSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Error reactivating session:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      await chatService.completeLearningSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Error completing session:', error);
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sesiones de Aprendizaje</h1>
          <p className="text-gray-600 mt-2">Gestiona tus sesiones de estudio y progreso</p>
        </div>
        <Button 
          onClick={() => navigate('/alumno/learning-sessions/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva Sesión
        </Button>
      </div>

      {/* Sesiones Activas */}
      {activeSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sesiones Activas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map((session) => (
              <Card key={session.session_id} className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{session.topic}</CardTitle>
                      {session.subtopic && (
                        <CardDescription className="text-sm text-gray-600">
                          {session.subtopic}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/alumno/learning-sessions/${session.session_id}`)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Ver Sesión
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => navigate(`/alumno/learning-sessions/${session.session_id}/chat`)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continuar Chat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handlePauseSession(session.session_id)}
                          disabled={actionLoading === session.session_id}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Completar sesión?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción marcará la sesión como completada. No podrás continuar el chat en esta sesión.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleCompleteSession(session.session_id)}
                                disabled={actionLoading === session.session_id}
                              >
                                Completar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusText(session.status)}
                    </Badge>
                    <Badge variant="outline" className={getLevelColor(session.level)}>
                      {session.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Iniciada: {new Date(session.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Todas las Sesiones */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Todas las Sesiones</h2>
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes sesiones de aprendizaje
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Crea tu primera sesión para comenzar a aprender de manera personalizada
              </p>
              <Button onClick={() => navigate('/alumno/learning-sessions/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Sesión
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card key={session.session_id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{session.topic}</CardTitle>
                      {session.subtopic && (
                        <CardDescription className="text-sm text-gray-600">
                          {session.subtopic}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/alumno/learning-sessions/${session.session_id}`)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        {session.status === 'active' && (
                          <DropdownMenuItem 
                            onClick={() => navigate(`/alumno/learning-sessions/${session.session_id}/chat`)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continuar Chat
                          </DropdownMenuItem>
                        )}
                        {session.status === 'paused' && (
                          <DropdownMenuItem 
                            onClick={() => handleReactivateSession(session.session_id)}
                            disabled={actionLoading === session.session_id}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Reactivar
                          </DropdownMenuItem>
                        )}
                        {session.status === 'completed' && (
                          <DropdownMenuItem 
                            onClick={() => navigate(`/alumno/learning-sessions/${session.session_id}/report`)}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            Ver Reporte
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusText(session.status)}
                    </Badge>
                    <Badge variant="outline" className={getLevelColor(session.level)}>
                      {session.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Iniciada: {new Date(session.created_at).toLocaleDateString()}
                    </div>
                    {session.completed_at && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Trophy className="h-4 w-4 mr-1" />
                        Completada: {new Date(session.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningSessionsPage;
