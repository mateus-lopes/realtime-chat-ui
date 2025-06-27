export interface IChatMessage {
  id: number | string;
  from: string;
  text: string;
  time: string;
  sent: boolean;
}

export interface IChat {
  id: number | string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: IChatMessage[];
}
