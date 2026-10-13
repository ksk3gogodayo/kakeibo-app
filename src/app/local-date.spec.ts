import { localDate } from './local-date';

describe('localDate', () => {
  it.each([
    [2026, 0, 1, 0, 30, '2026-01-01'],
    [2026, 9, 14, 8, 59, '2026-10-14'],
    [2026, 11, 31, 23, 59, '2026-12-31'],
    [2028, 1, 29, 0, 0, '2028-02-29'],
  ] as const)('formats local calendar components at boundaries (%s/%s/%s %s:%s)',
    (year, month, day, hour, minute, expected) => {
      expect(localDate(new Date(year, month, day, hour, minute))).toBe(expected);
    });
});
