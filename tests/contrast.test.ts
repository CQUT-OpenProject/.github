import { contrast } from '../apps/docs/src/contrast';
import { describe, expect, it } from 'vitest';

describe('approved accessible color pairs', () => {
  it.each([
    ['white on brand blue', '#FFFFFF', '#055088', 7],
    ['ink on mint', '#0B1F33', '#6ADFA3', 7],
    ['ink on soft blue', '#0B1F33', '#9FC1F9', 7],
    ['primary text on canvas', '#0B1F33', '#F7FAFC', 7],
    ['muted text on white', '#526577', '#FFFFFF', 4.5],
  ])('%s reaches its required ratio', (_name, foreground, background, minimum) => {
    expect(contrast(foreground as string, background as string)).toBeGreaterThanOrEqual(
      minimum as number,
    );
  });
});
