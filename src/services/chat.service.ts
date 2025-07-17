import apiService from "./api.service";
import apiConfig from "@/config/api.config";
import type { IUser } from "@/types/auth.types";
import type { IMessage } from "@/types/chat.types";

class ChatService {
  async getUsers(): Promise<IUser[]> {
    try {
      const response = await apiService.get<IUser[]>(
        apiConfig.ENDPOINTS.CHAT.USERS
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch users"
      );
    }
  }

  async getMessages(userId: string): Promise<IMessage[]> {
    try {
      const response = await apiService.get<IMessage[]>(
        `${apiConfig.ENDPOINTS.CHAT.MESSAGES}/${userId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch messages"
      );
    }
  }

  // async sendMessage(userId: string, message: string): Promise<any> {
  //     try {
  //         const response = await apiService.post<any>(
  //             `${apiConfig.ENDPOINTS.MESSAGES}/${userId}`,
  //             { message }
  //         );
  //         return response.data;
  //     } catch (error: any) {
  //         throw new Error(
  //             error.response?.data?.message || error.message || "Failed to send message"
  //         );
  //     }
  // }

  // async deleteMessage(messageId: string): Promise<void> {
  //     try {
  //         await apiService.delete(`${apiConfig.ENDPOINTS.MESSAGES}/${messageId}`);
  //     } catch (error: any) {
  //         throw new Error(
  //             error.response?.data?.message || error.message || "Failed to delete message"
  //         );
  //     }
  // }
}

export default new ChatService();
