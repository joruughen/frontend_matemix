import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../Components/ui/card';
import { Button } from '../../../Components/ui/button';
import { Input } from '../../../Components/ui/input';
import { Label } from '../../../Components/ui/label';
import { Textarea } from '../../../Components/ui/textarea';
import { ArrowLeft, BookOpen, Target, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../../Service/chat/service';
import type { CreateLearningSessionData } from '../../../Types/LearningSession/types';
import { useToast } from '../../../Components/ui/use-toast';

const CreateLearningSessionPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateLearningSessionData>({
    user_id: '',
    topic: '',
    subtopic: '',
    level: 'basico'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user_id = localStorage.getItem('userId_matemix') || 'default_user';
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user_id) {
      toast({
        title: "Error",
        description: "No se pudo identificar el usuario",
        variant: "destructive",
      });
      return;
    }

    if (!formData.topic.trim()) {
      toast({
        title: "Error",
        description: "El tema es obligatorio",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const sessionData = {
        ...formData,
        user_id: user_id,
        subtopic: formData.subtopic?.trim() || undefined
      };

      const response = await chatService.createLearningSession(sessionData);
      
      toast({
        title: "¡Sesión creada!",
        description: "Tu sesión de aprendizaje ha sido creada exitosamente",
      });

      // Navegar a la nueva sesión
      navigate(`/alumno/learning-sessions/${response.session_id}/chat`);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateLearningSessionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'basico':
        return 'Conceptos fundamentales y introducción al tema';
      case 'intermedio':
        return 'Desarrollo de habilidades y aplicación práctica';
      case 'avanzado':
        return 'Conceptos complejos y análisis profundo';
      default:
        return '';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'basico':
        return <BookOpen className="h-5 w-5 text-green-600" />;
      case 'intermedio':
        return <Target className="h-5 w-5 text-yellow-600" />;
      case 'avanzado':
        return <Brain className="h-5 w-5 text-red-600" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/alumno/learning-sessions')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Sesión de Aprendizaje</h1>
            <p className="text-gray-600 mt-1">Crea una sesión personalizada para tu aprendizaje</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Configuración de la Sesión
            </CardTitle>
            <CardDescription>
              Define el tema, nivel y objetivos de tu sesión de estudio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tema Principal */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium">
                  Tema Principal *
                </Label>
                <Input
                  id="topic"
                  placeholder="ej. Álgebra, Geometría, Cálculo..."
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Especifica el tema principal que quieres estudiar
                </p>
              </div>

              {/* Subtema */}
              <div className="space-y-2">
                <Label htmlFor="subtopic" className="text-sm font-medium">
                  Subtema (Opcional)
                </Label>
                <Textarea
                  id="subtopic"
                  placeholder="ej. Ecuaciones lineales, Teorema de Pitágoras, Límites..."
                  value={formData.subtopic}
                  onChange={(e) => handleInputChange('subtopic', e.target.value)}
                  className="w-full min-h-[80px]"
                />
                <p className="text-xs text-gray-500">
                  Añade más detalles sobre qué aspecto específico quieres estudiar
                </p>
              </div>

              {/* Nivel */}
              <div className="space-y-3">
                <Label htmlFor="level" className="text-sm font-medium">
                  Nivel de Dificultad *
                </Label>
                <select 
                  id="level"
                  value={formData.level} 
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="basico">Básico - Conceptos fundamentales</option>
                  <option value="intermedio">Intermedio - Aplicación práctica</option>
                  <option value="avanzado">Avanzado - Análisis profundo</option>
                </select>
                
                {/* Descripción del nivel seleccionado */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getLevelIcon(formData.level)}
                  <div>
                    <div className="font-medium text-sm capitalize">{formData.level}</div>
                    <div className="text-xs text-gray-600">
                      {getLevelDescription(formData.level)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/alumno/learning-sessions')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={loading || !formData.topic.trim()}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando...
                    </div>
                  ) : (
                    'Crear Sesión'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">¿Cómo funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <div className="font-medium text-sm">Configuración personalizada</div>
                <div className="text-xs text-gray-600">
                  Define tu tema y nivel para una experiencia adaptada
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <div className="font-medium text-sm">Aprendizaje interactivo</div>
                <div className="text-xs text-gray-600">
                  Chatea con el tutor IA y resuelve ejercicios adaptativos
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <div className="font-medium text-sm">Seguimiento de progreso</div>
                <div className="text-xs text-gray-600">
                  Recibe estadísticas y reportes de tu aprendizaje
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateLearningSessionPage;
