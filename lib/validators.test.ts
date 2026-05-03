import { describe, it, expect } from 'vitest';
import { epicSchema, chatMessageSchema } from './validators';

describe('epicSchema', () => {
  it('should validate correct EPIC numbers', () => {
    expect(epicSchema.safeParse({ epic: 'ABC1234567' }).success).toBe(true);
    expect(epicSchema.safeParse({ epic: 'XYZ9876543' }).success).toBe(true);
  });

  it('should fail when too short', () => {
    const result = epicSchema.safeParse({ epic: 'ABC123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('10 characters');
    }
  });

  it('should fail when too long', () => {
    const result = epicSchema.safeParse({ epic: 'ABC12345678' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('10 characters');
    }
  });

  it('should fail when format is wrong — digits before letters', () => {
    const result = epicSchema.safeParse({ epic: '123ABC4567' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Invalid EPIC format');
    }
  });

  it('should fail when only 2 letters prefix', () => {
    expect(epicSchema.safeParse({ epic: 'AB12345678' }).success).toBe(false);
  });

  it('should fail on empty string', () => {
    expect(epicSchema.safeParse({ epic: '' }).success).toBe(false);
  });

  it('should fail on lowercase letters', () => {
    expect(epicSchema.safeParse({ epic: 'abc1234567' }).success).toBe(false);
  });
});

describe('chatMessageSchema', () => {
  it('should validate valid chat messages', () => {
    expect(chatMessageSchema.safeParse({ message: 'Hello AI!' }).success).toBe(true);
    expect(chatMessageSchema.safeParse({ message: 'How do I register to vote?' }).success).toBe(true);
  });

  it('should fail on empty message', () => {
    expect(chatMessageSchema.safeParse({ message: '' }).success).toBe(false);
  });

  it('should fail on message exceeding 500 characters', () => {
    const longMessage = 'A'.repeat(501);
    expect(chatMessageSchema.safeParse({ message: longMessage }).success).toBe(false);
  });

  it('should pass on exactly 500 characters', () => {
    const maxMessage = 'A'.repeat(500);
    expect(chatMessageSchema.safeParse({ message: maxMessage }).success).toBe(true);
  });

  it('should fail on missing message field', () => {
    expect(chatMessageSchema.safeParse({}).success).toBe(false);
  });
});
