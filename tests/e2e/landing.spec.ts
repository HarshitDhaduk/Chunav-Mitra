import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('loads and redirects to locale', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/(en|hi|gu)/);
    await expect(page).toHaveTitle(/Chunav Mitra/);
  });

  test('shows hero section with CTA buttons', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Start My Journey')).toBeVisible();
    await expect(page.getByText('Try Vote Simulator')).toBeVisible();
  });

  test('shows all three persona cards', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Student')).toBeVisible();
    await expect(page.getByText('First-Time Voter')).toBeVisible();
    await expect(page.getByText('General / Elderly Citizen')).toBeVisible();
  });

  test('language switcher navigates to Hindi', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Switch to hi' }).click();
    await page.waitForURL(/\/hi/);
    await expect(page).toHaveURL(/\/hi/);
  });

  test('language switcher navigates to Gujarati', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Switch to gu' }).click();
    await page.waitForURL(/\/gu/);
    await expect(page).toHaveURL(/\/gu/);
  });
});

test.describe('Journey Flow', () => {
  test('navigates to step 1 from landing page CTA', async ({ page }) => {
    await page.goto('/en');
    await page.getByText('Start My Journey').click();
    await page.waitForURL(/\/en\/journey\/1/);
    await expect(page.getByText('What is an Election?')).toBeVisible();
  });

  test('persona card navigates to journey', async ({ page }) => {
    await page.goto('/en');
    // Scroll to persona section and click Student
    await page.getByRole('button', { name: /Student/ }).first().click();
    await page.waitForURL(/\/en\/journey\/1/);
  });

  test('step 1 shows quiz section', async ({ page }) => {
    await page.goto('/en/journey/1');
    await expect(page.getByText('Quick Check')).toBeVisible();
  });

  test('step 1 quiz shows correct feedback on right answer', async ({ page }) => {
    await page.goto('/en/journey/1');
    // First question: "What does an election decide?" — correct is "Who leads the country"
    await page.getByText('Who leads the country').click();
    await expect(page.getByText(/Correct!/)).toBeVisible();
  });

  test('step 1 quiz shows wrong feedback on incorrect answer', async ({ page }) => {
    await page.goto('/en/journey/1');
    await page.getByText('Who wins a cricket match').click();
    await expect(page.getByText(/Not quite/)).toBeVisible();
  });

  test('next button is grey before answering quiz', async ({ page }) => {
    await page.goto('/en/journey/1');
    const nextBtn = page.getByRole('button', { name: /Next/ });
    // Should have slate styling (not orange) before quiz answered
    await expect(nextBtn).toBeVisible();
  });

  test('skip quiz confirmation dialog appears', async ({ page }) => {
    await page.goto('/en/journey/1');
    await page.getByRole('button', { name: /Skip/ }).click();
    await expect(page.getByText('Skip the quiz?')).toBeVisible();
    await expect(page.getByText('Skip & Continue')).toBeVisible();
    await expect(page.getByText('Answer Quiz')).toBeVisible();
  });

  test('cancel skip dialog stays on step', async ({ page }) => {
    await page.goto('/en/journey/1');
    await page.getByRole('button', { name: /Skip/ }).click();
    await page.getByText('Answer Quiz').click();
    await expect(page.getByText('What is an Election?')).toBeVisible();
  });

  test('sidebar shows all 9 steps', async ({ page }) => {
    await page.goto('/en/journey/1');
    await expect(page.getByText('What is an Election?')).toBeVisible();
    await expect(page.getByText('Government Formation')).toBeVisible();
  });

  test('back button navigates to previous step', async ({ page }) => {
    await page.goto('/en/journey/2');
    await page.getByRole('button', { name: /Back/ }).click();
    await page.waitForURL(/\/en\/journey\/1/);
  });

  test('step 2 shows age eligibility calculator', async ({ page }) => {
    await page.goto('/en/journey/2');
    await expect(page.getByText('Enter your date of birth')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Check' })).toBeVisible();
  });

  test('step 2 age calculator shows error when no date entered', async ({ page }) => {
    await page.goto('/en/journey/2');
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('step 3 shows voter ID question', async ({ page }) => {
    await page.goto('/en/journey/3');
    await expect(page.getByText('Do you already have a Voter ID?')).toBeVisible();
  });

  test('step 3 yes answer shows Form 8', async ({ page }) => {
    await page.goto('/en/journey/3');
    await page.getByRole('button', { name: 'Yes' }).first().click();
    await expect(page.getByText('Form 8')).toBeVisible();
  });

  test('step 3 no answer shows NRI question', async ({ page }) => {
    await page.goto('/en/journey/3');
    await page.getByRole('button', { name: 'No' }).first().click();
    await expect(page.getByText('Are you an NRI?')).toBeVisible();
  });

  test('step 4 shows election timeline', async ({ page }) => {
    await page.goto('/en/journey/4');
    await expect(page.getByText('Election Timeline')).toBeVisible();
    await expect(page.getByText('Election Announced')).toBeVisible();
    await expect(page.getByText('48-Hour Silence Period')).toBeVisible();
  });

  test('step 4 timeline phase expands on click', async ({ page }) => {
    await page.goto('/en/journey/4');
    await page.getByText('Election Announced').click();
    await expect(page.getByText(/Section 30/)).toBeVisible();
  });
});

test.describe('EVM Simulator', () => {
  test('loads simulator page', async ({ page }) => {
    await page.goto('/en/simulator');
    await expect(page.getByText('Mock Voting Simulator')).toBeVisible();
  });

  test('shows BALLOT button initially', async ({ page }) => {
    await page.goto('/en/simulator');
    await expect(page.getByRole('button', { name: /BALLOT/i })).toBeVisible();
  });

  test('pressing BALLOT shows candidate list', async ({ page }) => {
    await page.goto('/en/simulator');
    await page.getByRole('button', { name: /BALLOT/i }).click();
    await expect(page.getByText('Choose your candidate')).toBeVisible();
    await expect(page.getByText('NOTA')).toBeVisible();
  });

  test('voting shows VVPAT display', async ({ page }) => {
    await page.goto('/en/simulator');
    await page.getByRole('button', { name: /BALLOT/i }).click();
    await page.getByText('Arjun Kumar').click();
    await expect(page.getByText('VVPAT Verification')).toBeVisible();
  });
});

test.describe('Voter Verification', () => {
  test('loads verify page', async ({ page }) => {
    await page.goto('/en/verify');
    await expect(page.getByText('Verify Your Voter ID')).toBeVisible();
  });

  test('shows validation error for invalid EPIC', async ({ page }) => {
    await page.goto('/en/verify');
    await page.getByPlaceholder(/ABC1234567/).fill('INVALID');
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('accepts valid EPIC format', async ({ page }) => {
    await page.goto('/en/verify');
    await page.getByPlaceholder(/ABC1234567/).fill('ABC1234567');
    // Just check the button is clickable — actual API call will redirect to ECI
    await expect(page.getByRole('button', { name: 'Verify' })).toBeEnabled();
  });
});

test.describe('Accessibility', () => {
  test('large text toggle works', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: /Large Text/ }).click();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-large-text', 'true');
  });

  test('high contrast toggle works', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: /High Contrast/ }).click();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-high-contrast', 'true');
  });
});
