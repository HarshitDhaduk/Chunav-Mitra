import { describe, it, expect, beforeEach } from 'vitest';
import { useJourneyStore } from './journeyStore';

describe('journeyStore', () => {
  beforeEach(() => {
    useJourneyStore.getState().reset();
  });

  it('should have correct initial state', () => {
    const state = useJourneyStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.totalXp).toBe(0);
    expect(state.level).toBe(1);
    expect(state.persona).toBeNull();
    expect(state.badges).toHaveLength(0);
  });

  it('should set persona correctly', () => {
    useJourneyStore.getState().setPersona('first-time');
    expect(useJourneyStore.getState().persona).toBe('first-time');

    useJourneyStore.getState().setPersona('student');
    expect(useJourneyStore.getState().persona).toBe('student');
  });

  it('should increment step', () => {
    useJourneyStore.getState().setStep(3);
    expect(useJourneyStore.getState().currentStep).toBe(3);
  });

  it('should add XP and accumulate per step', () => {
    useJourneyStore.getState().addXp(1, 15);
    expect(useJourneyStore.getState().totalXp).toBe(15);
    expect(useJourneyStore.getState().stepXp[1]).toBe(15);

    useJourneyStore.getState().addXp(1, 10);
    expect(useJourneyStore.getState().totalXp).toBe(25);
    expect(useJourneyStore.getState().stepXp[1]).toBe(25);
  });

  it('should add XP across multiple steps independently', () => {
    useJourneyStore.getState().addXp(1, 25);
    useJourneyStore.getState().addXp(2, 25);
    expect(useJourneyStore.getState().totalXp).toBe(50);
    expect(useJourneyStore.getState().stepXp[1]).toBe(25);
    expect(useJourneyStore.getState().stepXp[2]).toBe(25);
  });

  it('should level up correctly at 100 XP threshold', () => {
    useJourneyStore.getState().addXp(1, 50);
    expect(useJourneyStore.getState().level).toBe(1);

    useJourneyStore.getState().addXp(2, 60);
    expect(useJourneyStore.getState().totalXp).toBe(110);
    expect(useJourneyStore.getState().level).toBe(2);
  });

  it('should award badge and prevent duplicates', () => {
    useJourneyStore.getState().addBadge('firstVote');
    expect(useJourneyStore.getState().badges).toContain('firstVote');
    expect(useJourneyStore.getState().badges).toHaveLength(1);

    useJourneyStore.getState().addBadge('firstVote');
    expect(useJourneyStore.getState().badges).toHaveLength(1);
  });

  it('should award multiple different badges', () => {
    useJourneyStore.getState().addBadge('firstVote');
    useJourneyStore.getState().addBadge('simulatorPro');
    expect(useJourneyStore.getState().badges).toHaveLength(2);
    expect(useJourneyStore.getState().badges).toContain('simulatorPro');
  });

  it('should award bonus only once per step', () => {
    useJourneyStore.getState().awardBonus(1, 50);
    expect(useJourneyStore.getState().totalXp).toBe(50);

    useJourneyStore.getState().awardBonus(1, 50);
    expect(useJourneyStore.getState().totalXp).toBe(50); // not doubled
  });

  it('should set accessibility preferences', () => {
    useJourneyStore.getState().setAccessibilityPref('largeText', true);
    expect(useJourneyStore.getState().accessibilityPrefs.largeText).toBe(true);

    useJourneyStore.getState().setAccessibilityPref('highContrast', true);
    expect(useJourneyStore.getState().accessibilityPrefs.highContrast).toBe(true);
    // largeText should still be true
    expect(useJourneyStore.getState().accessibilityPrefs.largeText).toBe(true);
  });

  it('should reset to initial state', () => {
    useJourneyStore.getState().setPersona('student');
    useJourneyStore.getState().addXp(1, 50);
    useJourneyStore.getState().addBadge('firstVote');

    useJourneyStore.getState().reset();

    const state = useJourneyStore.getState();
    expect(state.persona).toBeNull();
    expect(state.totalXp).toBe(0);
    expect(state.badges).toHaveLength(0);
    expect(state.currentStep).toBe(1);
  });
});
