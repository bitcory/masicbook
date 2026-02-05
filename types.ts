
export type BookState = 'CLOSED' | 'OPENING' | 'OPEN';

export interface StoryMessage {
  role: 'user' | 'model';
  text: string;
}
