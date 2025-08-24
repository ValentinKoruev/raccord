import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient } from '@tanstack/react-query';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  const queryClient = new QueryClient();
  queryClient.clear();
});
