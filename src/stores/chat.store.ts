import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { IUser } from "@/types/auth.types";
import chatService from "@/services/chat.service";
import { IMessage } from "@/types/chat.types";

export const useChatStore = defineStore("chat", () => {
  const messages = ref<IMessage[]>([]);
  const users = ref<IUser[]>([
    // {
    //   _id: "1",
    //   email: "test1@test.com",
    //   fullName: "Test User 1",
    //   profilePicture: "https://example.com/avatar1.png",
    //   about: "This is a test user",
    //   isOnline: true,
    //   lastSeen: new Date(),
    // },
    // {
    //   _id: "2",
    //   email: "test2@test.com",
    //   fullName: "Test User 2",
    //   profilePicture: "https://example.com/avatar2.png",
    //   about: "This is another test user",
    //   isOnline: false,
    //   lastSeen: new Date(),
    // },
  ]);
  const selectedUser = ref<IUser>({
    _id: "",
    fullName: "",
    email: "",
    profilePicture: "",
    about: "",
    isOnline: false,
  });
  const isUserLoading = ref(false);
  const isMessagesLoading = ref(false);
  const error = ref<string | null>(null);

  const userName = computed(() => selectedUser.value?.fullName || "");
  const userAvatar = computed(() => selectedUser.value?.profilePicture || "");
  const userEmail = computed(() => selectedUser.value?.email || "");

  const getUsers = async () => {
    isUserLoading.value = true;
    try {
      const response = await chatService.getUsers();
      users.value = response;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isUserLoading.value = false;
    }
  };

  const getMessages = async (userId: string) => {
    isMessagesLoading.value = true;
    try {
      const response = await chatService.getMessages(userId);
      messages.value = response;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isMessagesLoading.value = false;
    }
  };

  const selectChat = (userId: string) => {
    const user = users.value.find((u) => u._id === userId);
    if (user) {
      selectedUser.value = user;
      getMessages(userId);
    } else {
      error.value = "User not found";
    }
  };

  return {
    messages,
    users,
    selectedUser,
    isUserLoading,
    isMessagesLoading,
    error,

    userName,
    userAvatar,
    userEmail,

    getUsers,
    getMessages,
    selectChat,
  };
});
