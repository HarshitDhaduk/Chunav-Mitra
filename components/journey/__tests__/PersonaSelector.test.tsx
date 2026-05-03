import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { PersonaSelector } from '../PersonaSelector';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ locale: 'en' }),
}));

vi.mock('@/context/journeyStore', () => ({
  useJourneyStore: () => ({ setPersona: vi.fn() }),
}));

const messages = {
  persona: {
    title: 'Who are you?',
    subtitle: 'We will personalize your journey.',
    student: 'Student',
    studentDesc: 'Under 18, learning about democracy.',
    'first-time': 'First-Time Voter',
    'first-timeDesc': 'Newly eligible, ready to vote.',
    general: 'General / Elderly Citizen',
    generalDesc: 'Looking for logistical help.',
  },
};

function renderSelector() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PersonaSelector />
    </NextIntlClientProvider>
  );
}

describe('PersonaSelector', () => {
  it('renders the title and subtitle', () => {
    renderSelector();
    expect(screen.getByText('Who are you?')).toBeInTheDocument();
    expect(screen.getByText('We will personalize your journey.')).toBeInTheDocument();
  });

  it('renders all three persona cards', () => {
    renderSelector();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('First-Time Voter')).toBeInTheDocument();
    expect(screen.getByText('General / Elderly Citizen')).toBeInTheDocument();
  });

  it('renders persona descriptions', () => {
    renderSelector();
    expect(screen.getByText('Under 18, learning about democracy.')).toBeInTheDocument();
  });

  it('navigates to journey step 1 on persona selection', () => {
    renderSelector();
    fireEvent.click(screen.getByText('Student'));
    expect(mockPush).toHaveBeenCalledWith('/en/journey/1');
  });
});
