
export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export type Theme = 'light' | 'dark';
export type ActiveView = 'chat' | 'ask-teachers' | 'about';

export enum BotState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}
