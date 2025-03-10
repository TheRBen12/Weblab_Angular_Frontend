export interface Email {
  deletedAt: number;
  id: number;
  sender: string,
  date: string,
  receiver: string,
  body: string,
  subject: string
  user: number;
}
