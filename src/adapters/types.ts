/**
 * Platform Adapter Interface
 * Abstracts away fragile DOM selectors per platform
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isComplete: boolean;
  timestamp: number;
}

export interface PlatformAdapter {
  /**
   * Start observing chat for new messages
   * @param callback - Called when new message is detected
   */
  observe(callback: (msg: ChatMessage) => void): void;
  
  /**
   * Stop observing and clean up
   */
  disconnect(): void;
  
  /**
   * Get platform name for debugging
   */
  getPlatformName(): string;
}
