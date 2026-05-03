import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { GamifiedQuiz } from '../GamifiedQuiz';

// Mock zustand store
vi.mock('@/context/journeyStore', () => ({
  useJourneyStore: () => ({ addXp: vi.fn() }),
}));

const messages = {
  journey: {
    quizTitle: 'Quick Check',
    quizCorrect: 'Correct! +{points} points',
    quizWrong: 'Not quite. The answer is: {answer}',
    completeStep: 'Complete Step',
    nextQuestion: 'Next Question',
  },
};

const SINGLE_QUESTION = [
  {
    question: 'What is the minimum voting age in India?',
    options: ['16', '18', '21'],
    correctIndex: 1,
  },
];

const MULTI_QUESTIONS = [
  {
    question: 'Question 1?',
    options: ['Wrong A', 'Correct B', 'Wrong C'],
    correctIndex: 1,
  },
  {
    question: 'Question 2?',
    options: ['Correct A', 'Wrong B'],
    correctIndex: 0,
  },
];

function renderQuiz(questions = SINGLE_QUESTION, onAnswered = vi.fn()) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <GamifiedQuiz stepNumber={1} questions={questions} onAnswered={onAnswered} />
    </NextIntlClientProvider>
  );
}

describe('GamifiedQuiz', () => {
  it('renders the quiz title and first question', () => {
    renderQuiz();
    expect(screen.getByText('Quick Check')).toBeInTheDocument();
    expect(screen.getByText('What is the minimum voting age in India?')).toBeInTheDocument();
  });

  it('renders all answer options', () => {
    renderQuiz();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('shows correct feedback on right answer', () => {
    renderQuiz();
    fireEvent.click(screen.getByText('18'));
    expect(screen.getByText(/Correct!/)).toBeInTheDocument();
  });

  it('shows wrong feedback on incorrect answer', () => {
    renderQuiz();
    fireEvent.click(screen.getByText('16'));
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
  });

  it('disables options after answering', () => {
    renderQuiz();
    fireEvent.click(screen.getByText('18'));
    const buttons = screen.getAllByRole('button').filter(b => ['16', '18', '21'].includes(b.textContent ?? ''));
    buttons.forEach(btn => expect(btn).toBeDisabled());
  });

  it('calls onAnswered with true for correct answer after completing all questions', () => {
    const onAnswered = vi.fn();
    renderQuiz(SINGLE_QUESTION, onAnswered);
    fireEvent.click(screen.getByText('18'));
    fireEvent.click(screen.getByText('Complete Step'));
    expect(onAnswered).toHaveBeenCalledWith(true);
  });

  it('calls onAnswered with false for wrong answer', () => {
    const onAnswered = vi.fn();
    renderQuiz(SINGLE_QUESTION, onAnswered);
    fireEvent.click(screen.getByText('16'));
    fireEvent.click(screen.getByText('Complete Step'));
    expect(onAnswered).toHaveBeenCalledWith(false);
  });

  it('shows question counter for multiple questions', () => {
    renderQuiz(MULTI_QUESTIONS);
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('advances to next question after answering', () => {
    renderQuiz(MULTI_QUESTIONS);
    fireEvent.click(screen.getByText('Correct B'));
    fireEvent.click(screen.getByText('Next Question'));
    expect(screen.getByText('Question 2?')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });
});
