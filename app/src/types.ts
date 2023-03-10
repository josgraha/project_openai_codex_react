import { UUID } from 'uuid';

export interface UserProfile {
  avatarUrl?: string;
  name: string;
  username: string;
}

export interface ChatMessage {
  isAI?: boolean;
  isLoading?: boolean;
  message: string;
  uniqueId: UUID;
  user?: UserProfile;
}
