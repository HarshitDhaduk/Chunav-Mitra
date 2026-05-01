import { describe, it, expect } from 'vitest';
import { epicSchema, chatMessageSchema } from './validators';

describe('Validators', () => {
  describe('epicSchema', () => {
    it('should validate correct EPIC numbers', () => {
      const result = epicSchema.safeParse({ epic: 'ABC1234567' });
      expect(result.success).toBe(true);
    });

    it('should fail on incorrect length', () => {
      const result = epicSchema.safeParse({ epic: 'ABC123456' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 characters');
      }
    });

    it('should fail on incorrect format', () => {
      const result = epicSchema.safeParse({ epic: '123ABC4567' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid EPIC format');
      }
    });
  });

  describe('chatMessageSchema', () => {
    it('should validate valid chat messages', () => {
      const result = chatMessageSchema.safeParse({ message: 'Hello AI!' });
      expect(result.success).toBe(true);
    });

    it('should fail on empty messages', () => {
      const result = chatMessageSchema.safeParse({ message: '' });
      expect(result.success).toBe(false);
    });

    it('should fail on extremely long messages', () => {
      const longMessage = 'A'.repeat(501);
      const result = chatMessageSchema.safeParse({ message: longMessage });
      expect(result.success).toBe(false);
    });
  });
});
