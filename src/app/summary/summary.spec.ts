import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Summary } from './summary';
import { LangService } from '../lang.service';

const mocks = vi.hoisted(() => ({
  snapshot: undefined as any,
  unsubscribe: vi.fn(),
  chart: vi.fn(),
  destroy: vi.fn(),
}));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'test-user' } }),
  GoogleAuthProvider: class {},
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  collection: vi.fn(),
  onSnapshot: vi.fn((_ref, callback) => {
    mocks.snapshot = callback;
    return mocks.unsubscribe;
  }),
}));
vi.mock('chart.js', () => ({
  registerables: [],
  Chart: class {
    static register() {}
    constructor(...args: any[]) {
      mocks.chart(...args);
    }
    destroy() {
      mocks.destroy();
    }
  },
}));

describe('Summary', () => {
  let component: Summary;
  let fixture: ComponentFixture<Summary>;
  const entry = (id: string, date: string, amount: number, type?: string) => ({
    id,
    date,
    amount,
    type,
    title: `Item ${id}`,
    category: 'Food',
    billingMethod: 'Cash',
  });
  const publish = (entries: any[]) => {
    mocks.snapshot({ docs: entries.map((e) => ({ id: e.id, data: () => e })) });
    fixture.detectChanges();
  };
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({ imports: [Summary] }).compileComponents();
    TestBed.inject(LangService).lang = 'ja';
    fixture = TestBed.createComponent(Summary);
    component = fixture.componentInstance;
    component.selectedMonth = '2026-10';
    fixture.detectChanges();
  });
  it('groups income and legacy expenses by date, excludes other months and sorts newest first', () => {
    publish([
      entry('a', '2026-10-01', 300),
      entry('b', '2026-10-01', 1000, 'income'),
      entry('c', '2026-10-02', 200, 'expense'),
      entry('d', '2026-09-30', 999),
      entry('e', '2026-10-01', -50),
    ]);
    expect(component.dailyGroups.map((g) => [g.date, g.income, g.expense, g.balance])).toEqual([
      ['2026-10-02', 0, 200, -200],
      ['2026-10-01', 1000, 250, 750],
    ]);
    expect(component.monthTotal).toBe(450);
    expect(component.billingGroups[0].total).toBe(450);
  });
  it('renders the initial chart after the snapshot and restores it after one-tap switching', () => {
    publish([entry('a', '2026-10-01', 300)]);
    expect(mocks.chart).toHaveBeenCalledTimes(1);
    const buttons = () => fixture.nativeElement.querySelectorAll('.view-switch button');
    buttons()[1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('canvas')).toBeNull();
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('true');
    buttons()[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('canvas')).toBeTruthy();
    expect(mocks.chart).toHaveBeenCalledTimes(2);
    expect(component.monthTotal).toBe(300);
  });
  it('expands and collapses a date and preserves expansion on live updates', () => {
    publish([entry('a', '2026-10-01', 300)]);
    component.setView('daily');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.day-header') as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.day-details').hidden).toBe(false);
    publish([entry('a', '2026-10-01', 400), entry('b', '2026-10-01', 700, 'income')]);
    expect(component.dailyGroups[0].expanded).toBe(true);
    expect(component.dailyGroups[0].balance).toBe(300);
    expect(fixture.nativeElement.querySelectorAll('.daily-entry').length).toBe(2);
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.day-details').hidden).toBe(true);
  });
  it('navigates across years and shows an empty month without stale days', () => {
    component.selectedMonth = '2026-01';
    publish([entry('a', '2025-12-31', 10)]);
    component.setView('daily');
    component.prevMonth();
    expect(component.selectedMonth).toBe('2025-12');
    expect(component.dailyGroups.length).toBe(1);
    component.nextMonth();
    expect(component.selectedMonth).toBe('2026-01');
    expect(component.dailyGroups).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('まだ記録がありません');
  });
  it('supports income-only and zero-value days and all three languages', () => {
    publish([entry('a', '2026-10-01', 0), entry('b', '2026-10-02', 100, 'income')]);
    component.setView('daily');
    expect(component.dailyGroups[0].balance).toBe(100);
    expect(component.dailyGroups[1].balance).toBe(0);
    for (const lang of ['ja', 'en', 'fil'] as const) {
      TestBed.inject(LangService).lang = lang;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(component.t.income);
      expect(fixture.nativeElement.textContent).toContain(component.t.balance);
    }
  });
  it('releases the snapshot subscription and chart on destruction', () => {
    publish([entry('a', '2026-10-01', 300)]);
    fixture.destroy();
    expect(mocks.unsubscribe).toHaveBeenCalledTimes(1);
    expect(mocks.destroy).toHaveBeenCalled();
  });
  it('sorts each daily total numerically, including negative balances and ties', () => {
    publish([entry('a', '2026-10-01', 100), entry('b', '2026-10-02', 9, 'income'),
      entry('c', '2026-10-03', 20), entry('d', '2026-10-03', 200, 'income')]);
    const dates = (order: string) => {
      component.sortOrder = order;
      return component.sortedDailyGroups.map(g => g.date.slice(-2));
    };
    expect(dates('date-asc')).toEqual(['01', '02', '03']);
    expect(dates('date-desc')).toEqual(['03', '02', '01']);
    expect(dates('income-asc')).toEqual(['01', '02', '03']);
    expect(dates('income-desc')).toEqual(['03', '02', '01']);
    expect(dates('expense-asc')).toEqual(['02', '03', '01']);
    expect(dates('expense-desc')).toEqual(['01', '03', '02']);
    expect(dates('balance-asc')).toEqual(['01', '02', '03']);
    expect(dates('balance-desc')).toEqual(['03', '02', '01']);
    expect(component.dailyGroups.map(g => g.date.slice(-2))).toEqual(['03', '02', '01']);
    publish([entry('a', '2026-10-01', 0), entry('b', '2026-10-02', 0)]);
    expect(dates('balance-asc')).toEqual(['02', '01']);
  });

  it('keeps the expanded date and selected sort after live updates and view switching', async () => {
    publish([entry('a', '2026-10-01', 100), entry('b', '2026-10-02', 9)]);
    component.setView('daily');
    fixture.nativeElement.querySelector('.day-header').click(); fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('#summary-sort') as HTMLSelectElement;
    select.value = 'expense-desc'; select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('time').getAttribute('datetime')).toBe('2026-10-01');
    expect(component.dailyGroups.find(g => g.date === '2026-10-02')?.expanded).toBe(true);
    publish([entry('a', '2026-10-01', 100), entry('b', '2026-10-02', 200)]);
    expect(fixture.nativeElement.querySelector('time').getAttribute('datetime')).toBe('2026-10-02');
    expect(fixture.nativeElement.querySelector('.day-header').getAttribute('aria-expanded')).toBe('true');
    component.setView('monthly'); component.setView('daily');
    expect(component.sortOrder).toBe('expense-desc');
    expect(component.monthTotal).toBe(300);
    component.prevMonth();
    expect(component.sortedDailyGroups).toEqual([]);
  });

});
