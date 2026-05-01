import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeButton } from '../HomeButton';
import { NextIntlClientProvider } from 'next-intl';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ locale: 'en' }),
}));

// Mock minimal messages for translation
const messages = {
  journey: {
    dialogs: {
      leave: {
        title: "Leave Journey",
        description: "Are you sure?",
        confirm: "Yes",
        cancel: "No"
      }
    }
  },
  common: {
    back: "Back"
  }
};

describe('HomeButton Component', () => {
  it('renders standard text button by default', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HomeButton />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('renders logo variant when asLogo is true', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HomeButton asLogo={true} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Chunav Mitra')).toBeInTheDocument();
  });

  it('opens confirmation dialog on click', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HomeButton />
      </NextIntlClientProvider>
    );
    
    const button = screen.getByText('Back');
    fireEvent.click(button);
    
    // Dialog content should now be visible
    expect(screen.getByText('Leave Journey')).toBeInTheDocument();
  });
});
