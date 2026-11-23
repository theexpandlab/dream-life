import { describe, expect, it } from 'vitest';

import { band, monthPulse, monthlyScore, streak, summarize, type MonthRow } from './scores';

const all = (n: number) => ({
  career: n, finance: n, health: n, family: n, romance: n,
  fun: n, growth: n, spirituality: n, home: n, contribution: n,
});

describe('monthlyScore', () => {
  it('is the mean of the 10 areas, 1 decimal', () => {
    expect(monthlyScore({ ...all(7), career: 10, finance: 4 })).toBe(7); // (70 - 14 + 14) / 10
    expect(monthlyScore({ ...all(7), career: 8 })).toBe(7.1);
  });
  it('rounds to 1 decimal', () => {
    expect(monthlyScore({ career: 7, finance: 8, health: 8 })).toBe(7.7); // 7.666...
  });
  it('is null when nothing is scored', () => {
    expect(monthlyScore({})).toBeNull();
  });
});

describe('band', () => {
  it('8+ thriving, 5 to 7 okay, 4 or below needs love', () => {
    expect(band(8)).toBe('thriving');
    expect(band(7)).toBe('okay');
    expect(band(5)).toBe('okay');
    expect(band(4)).toBe('needs love');
  });
});

describe('summarize', () => {
  const sep: MonthRow = { month: '2026-09', ...all(6) };
  const oct: MonthRow = { month: '2026-10', ...all(7), spirituality: 9, romance: 3 };
  const nov: MonthRow = { month: '2026-11', ...all(8), health: 9, spirituality: 9, finance: 4 };

  it('returns null with no check-ins', () => {
    expect(summarize([])).toBeNull();
  });

  it('uses the latest month, whatever order rows arrive in', () => {
    const s = summarize([nov, sep, oct])!;
    expect(s.month).toBe('2026-11');
    expect(s.score).toBe(7.8); // (80 + 1 + 1 - 4) / 10
    expect(s.since).toBe('2026-09');
    expect(s.months).toBe(3);
  });

  it('change = latest minus previous month', () => {
    const s = summarize([oct, nov])!;
    expect(s.change).toBe(1); // 7.8 - 6.8
  });

  it('change is null with only one month', () => {
    expect(summarize([nov])!.change).toBeNull();
  });

  it('all-time = mean of monthly scores', () => {
    expect(summarize([sep, oct, nov])!.allTime).toBe(6.9); // (6 + 6.8 + 7.8) / 3 = 6.867
  });

  it('strongest and weakest are first in area order on ties', () => {
    const s = summarize([nov])!;
    expect(s.strongest).toEqual({ area: 'health', score: 9 }); // health comes before spirituality
    expect(s.weakest).toEqual({ area: 'finance', score: 4 });
  });
});

describe('streak', () => {
  const today = new Date(2026, 10, 21); // Nov 21
  it('counts back from today', () => {
    expect(streak(['2026-11-21', '2026-11-20', '2026-11-19', '2026-11-17'], today)).toBe(3);
  });
  it('counts from yesterday when today is not logged yet', () => {
    expect(streak(['2026-11-20', '2026-11-19'], today)).toBe(2);
  });
  it('is 0 when neither today nor yesterday is logged', () => {
    expect(streak(['2026-11-18'], today)).toBe(0);
  });
  it('crosses month boundaries', () => {
    expect(streak(['2026-12-01', '2026-11-30'], new Date(2026, 11, 1))).toBe(2);
  });
});

describe('monthPulse', () => {
  const today = new Date(2026, 10, 21);
  it('rate = check-offs / (days logged x 10), this month only', () => {
    const p = monthPulse(
      [
        { date: '2026-11-20', career: true, health: true, home: true },
        { date: '2026-11-21', spirituality: true },
        { date: '2026-10-31', career: true, finance: true }, // last month, ignored
      ],
      today,
    );
    expect(p).toEqual({ daysLogged: 2, rate: 20 }); // 4 / 20
  });
  it('rate is null with no days this month', () => {
    expect(monthPulse([], today)).toEqual({ daysLogged: 0, rate: null });
  });
});
