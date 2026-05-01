import { describe, it, expect, beforeEach } from 'vitest';
import { useJourneyStore } from './journeyStore';

describe('journeyStore', () => {
  // Reset store before each test
  beforeEach(() => {
    useJourneyStore.getState().reset();
  });

  it('should have correct initial state', () => {
    const state = useJourneyStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.totalXp).toBe(0);
    expect(state.level).toBe(1);
    expect(state.persona).toBeNull();
  });

  it('should set persona', () => {
    useJourneyStore.getState().setPersona('first-time');
    expect(useJourneyStore.getState().persona).toBe('first-time');
  });

  it('should increment step', () => {
    useJourneyStore.getState().setStep(2);
    expect(useJourneyStore.getState().currentStep).toBe(2);
  });

  it('should add XP and correctly level up', () => {
    const addXp = useJourneyStore.getState().addXp;
    
    // Add 50 XP (less than 100 needed for level 2)
    addXp(1, 50);
    expect(useJourneyStore.getState().totalXp).toBe(50);
    expect(useJourneyStore.getState().level).toBe(1);

    // Add 60 more XP (total 110, should reach level 2)
    addXp(2, 60);
    expect(useJourneyStore.getState().totalXp).toBe(110);
    expect(useJourneyStore.getState().level).toBe(2);
  });

  it('should award badge only once', () => {
    const addBadge = useJourneyStore.getState().addBadge;
    
    addBadge('firstVote');
    expect(useJourneyStore.getState().badges).toContain('firstVote');
    expect(useJourneyStore.getState().badges.length).toBe(1);

    // Try adding the same badge again
    addBadge('firstVote');
    expect(useJourneyStore.getState().badges.length).toBe(1);
  });
});
