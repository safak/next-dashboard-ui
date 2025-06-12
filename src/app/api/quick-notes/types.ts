export interface QuickNoteRequest {
  content: string;
}

export interface QuickNoteResponse {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
}
