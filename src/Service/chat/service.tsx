
import { axiosInstanceChat } from "../AxiosConfig";
class ChatService {
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
}

export const chatService = new ChatService();