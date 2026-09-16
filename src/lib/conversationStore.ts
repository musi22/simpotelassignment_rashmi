import { ConversationSession, ConversationTurn, AvailabilityRequestDetails } from './types';

/**
 * In-memory conversation store for local session continuity.
 * 
 * Design notes & limitations:
 * - Isolated per conversationId.
 * - Bounded history: retains up to MAX_TURNS per conversation (default 10) to avoid unbounded token growth.
 * - Auto-expiration: sessions older than 1 hour (TTL) are pruned automatically.
 * - Limitation: In-memory store does not persist across server restarts or multi-instance serverless deployments.
 *   In production, replace with Redis or a persistent database with encryption-at-rest.
 */
class ConversationStore {
  private sessions = new Map<string, ConversationSession>();
  private readonly MAX_TURNS = 10;
  private readonly SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

  public getOrCreateSession(conversationId: string): ConversationSession {
    this.cleanupExpiredSessions();
    const existing = this.sessions.get(conversationId);
    if (existing) {
      existing.updatedAt = Date.now();
      return existing;
    }

    const newSession: ConversationSession = {
      id: conversationId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      turns: [],
      pendingAvailability: {},
    };
    this.sessions.set(conversationId, newSession);
    return newSession;
  }

  public getSession(conversationId: string): ConversationSession | undefined {
    return this.sessions.get(conversationId);
  }

  public addTurn(
    conversationId: string,
    turn: Omit<ConversationTurn, 'id' | 'timestamp'>
  ): ConversationTurn {
    const session = this.getOrCreateSession(conversationId);
    const fullTurn: ConversationTurn = {
      ...turn,
      id: `turn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    session.turns.push(fullTurn);
    if (session.turns.length > this.MAX_TURNS) {
      session.turns = session.turns.slice(-this.MAX_TURNS);
    }
    session.updatedAt = Date.now();
    return fullTurn;
  }

  public updatePendingAvailability(
    conversationId: string,
    details: Partial<AvailabilityRequestDetails>
  ): AvailabilityRequestDetails {
    const session = this.getOrCreateSession(conversationId);
    session.pendingAvailability = {
      ...session.pendingAvailability,
      ...details,
    };
    session.updatedAt = Date.now();
    return session.pendingAvailability;
  }

  public clearSession(conversationId: string): void {
    this.sessions.delete(conversationId);
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    this.sessions.forEach((session, id) => {
      if (now - session.updatedAt > this.SESSION_TTL_MS) {
        this.sessions.delete(id);
      }
    });
  }
}

export const conversationStore = new ConversationStore();
