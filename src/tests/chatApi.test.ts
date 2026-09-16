import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../app/api/chat/route';
import { conversationStore } from '../lib/conversationStore';
import { NextRequest } from 'next/server';

function createJsonRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/chat Integration Tests', () => {
  const convId1 = 'test_session_alpha';
  const convId2 = 'test_session_beta';

  beforeEach(() => {
    conversationStore.clearSession(convId1);
    conversationStore.clearSession(convId2);
  });

  it('validates required message and rejects empty string with 400', async () => {
    const req = createJsonRequest({ message: '   ' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
    expect(data.error.code).toBe('INVALID_INPUT');
  });

  it('rejects message exceeding 1000 characters with 400', async () => {
    const longMsg = 'a'.repeat(1005);
    const req = createJsonRequest({ message: longMsg });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe('INVALID_INPUT');
  });

  it('maintains strict conversation isolation between distinct sessions', async () => {
    // Conv 1 asks about pool
    const req1 = createJsonRequest({
      conversationId: convId1,
      message: 'Does the hotel have a pool?',
    });
    const res1 = await POST(req1);
    expect(res1.status).toBe(200);

    // Conv 2 asks about breakfast
    const req2 = createJsonRequest({
      conversationId: convId2,
      message: 'Is breakfast included?',
    });
    const res2 = await POST(req2);
    expect(res2.status).toBe(200);

    const session1 = conversationStore.getSession(convId1);
    const session2 = conversationStore.getSession(convId2);

    expect(session1?.turns.some((t) => t.content.includes('pool'))).toBe(true);
    expect(session1?.turns.some((t) => t.content.includes('breakfast'))).toBe(false);

    expect(session2?.turns.some((t) => t.content.includes('breakfast'))).toBe(true);
    expect(session2?.turns.some((t) => t.content.includes('pool'))).toBe(false);
  });

  it('returns valid structured contract on successful answer', async () => {
    const req = createJsonRequest({
      conversationId: convId1,
      message: 'What time is check-in?',
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.conversationId).toBe(convId1);
    expect(data.responseType).toBe('answer');
    expect(typeof data.message).toBe('string');
    expect(Array.isArray(data.supportingFactIds)).toBe(true);
    expect(data.supportingFactIds).toContain('fact_checkin_checkout');
  });
});
