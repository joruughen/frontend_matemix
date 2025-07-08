
import { axiosInstanceChat } from "../AxiosConfig";
class ChatService {
    // Chat y conversaciones
    async getAllConversations(userId: string) {
        try {
            const response = await axiosInstanceChat.get(`/conversations/${userId}`);
            console.log('Conversations fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }
    async getConversationById(userId: string, conversationId: string) {
        try {
            const response = await axiosInstanceChat.get(`/conversation/${userId}/${conversationId}`);
            console.log('Conversation fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }
    async deleteConversation(userId: string, conversationId: string) {
        try {
            const response = await axiosInstanceChat.delete(`/conversation/${userId}/${conversationId}`);
            console.log('Conversation deleted:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    }

    // Sesiones de aprendizaje
    async createLearningSession(data: {
        user_id: string;
        topic: string;
        subtopic?: string;
        level: 'basico' | 'intermedio' | 'avanzado';
    }) {
        try {
            const response = await axiosInstanceChat.post('/learning/session/create', data);
            console.log('Learning session created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating learning session:', error);
            throw error;
        }
    }

    async chatInLearningSession(data: {
        session_id: string;
        message: string;
        user_id?: string;
    }) {
        try {
            const response = await axiosInstanceChat.post(`/learning/session/${data.session_id}/chat`, {
                user_id: data.user_id,
                message: data.message
            });
            console.log('Chat message sent:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }
    }

    async getLearningSession(sessionId: string) {
        try {
            const response = await axiosInstanceChat.get(`/learning/session/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching learning session:', error);
            throw error;
        }
    }

    async getLearningSessionHistory(sessionId: string) {
        try {
            const response = await axiosInstanceChat.get(`/learning/session/${sessionId}/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching session history:', error);
            throw error;
        }
    }

    async getLearningSessionStats(sessionId: string) {
        try {
            const response = await axiosInstanceChat.get(`/learning/session/${sessionId}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching session stats:', error);
            throw error;
        }
    }

    async getUserLearningSessions(userId: string, status?: string) {
        try {
            const params = status ? { status } : {};
            const response = await axiosInstanceChat.get(`/learning/sessions/${userId}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching user sessions:', error);
            throw error;
        }
    }

    async getActiveLearningSessions(userId: string) {
        try {
            const response = await axiosInstanceChat.get(`/learning/sessions/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching active sessions:', error);
            throw error;
        }
    }

    async pauseLearningSession(sessionId: string) {
        try {
            const response = await axiosInstanceChat.post(`/learning/session/${sessionId}/pause`);
            return response.data;
        } catch (error) {
            console.error('Error pausing session:', error);
            throw error;
        }
    }

    async reactivateLearningSession(sessionId: string) {
        try {
            const response = await axiosInstanceChat.post(`/learning/session/${sessionId}/reactivate`);
            return response.data;
        } catch (error) {
            console.error('Error reactivating session:', error);
            throw error;
        }
    }

    async completeLearningSession(sessionId: string) {
        try {
            const response = await axiosInstanceChat.post(`/learning/session/${sessionId}/complete`);
            return response.data;
        } catch (error) {
            console.error('Error completing session:', error);
            throw error;
        }
    }

    // Dashboard y progreso
    async getTutorDashboard(userId: string) {
        try {
            const response = await axiosInstanceChat.get(`/tutor/dashboard/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tutor dashboard:', error);
            throw error;
        }
    }

    async getUserProgress(userId: string) {
        try {
            const response = await axiosInstanceChat.get(`/tutor/progress/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user progress:', error);
            throw error;
        }
    }

    async getUserRecommendations(userId: string) {
        try {
            const response = await axiosInstanceChat.get(`/tutor/recommendations/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    }

    // Ejercicios adaptativos
    async generateAdaptiveExercises(data: {
        user_id: string;
        topic: string;
        cantidad: number;
    }) {
        try {
            const response = await axiosInstanceChat.post('/tutor/exercises/adaptive', data);
            return response.data;
        } catch (error) {
            console.error('Error generating adaptive exercises:', error);
            throw error;
        }
    }

    async getNextExerciseBatch(userId: string, topic: string, count: number = 3) {
        try {
            const response = await axiosInstanceChat.get(`/tutor/exercises/${userId}/next-batch`, {
                params: { topic, count }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching next exercise batch:', error);
            throw error;
        }
    }

    async completeExercise(data: {
        user_id: string;
        session_id: string;
        exercise_id: string;
        user_answer: string;
        is_correct: boolean;
        time_taken?: number;
    }) {
        try {
            const response = await axiosInstanceChat.post('/tutor/exercise/complete', data);
            return response.data;
        } catch (error) {
            console.error('Error completing exercise:', error);
            throw error;
        }
    }

    // Reportes PDF
    async downloadSessionPDFReport(sessionId: string) {
        try {
            const response = await axiosInstanceChat.get(`/learning/session/${sessionId}/pdf-report`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Error downloading PDF report:', error);
            throw error;
        }
    }

    async downloadSessionPDFExercises(sessionId: string) {
        try {
            const response = await axiosInstanceChat.get(`/learning/session/${sessionId}/pdf-exercises`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Error downloading PDF exercises:', error);
            throw error;
        }
    }
}

export const chatService = new ChatService();