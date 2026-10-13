import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Entries } from './entries';

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'test-user' } }),
  GoogleAuthProvider: class {},
}));
vi.mock('firebase/firestore', () => ({
  serverTimestamp: vi.fn(() => 'server-time'),
  getFirestore: () => ({}),
  collection: vi.fn(() => 'entries'),
  doc: vi.fn(() => 'document'),
  onSnapshot: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({}),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
}));

describe('Entries', () => {
  let component: Entries;
  let fixture: ComponentFixture<Entries>;
  const legacy = {
    id: 'old',
    title: 'Lunch',
    amount: 500,
    category: 'Food',
    paymentMethod: 'Cash',
    billingMethod: 'Cash',
    date: '2026-10-01',
  };
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    await TestBed.configureTestingModule({ imports: [Entries] }).compileComponents();
    fixture = TestBed.createComponent(Entries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('defaults to expense and saves a new income selected in the form', async () => {
    expect(component.entry.type).toBe('expense');
    const select = fixture.nativeElement.querySelector('#entry-type') as HTMLSelectElement;
    select.value = 'income';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    component.entry.title = 'Salary';
    component.entry.amount = 200000;
    await component.save();
    expect(addDoc).toHaveBeenCalledWith(
      'entries',
      expect.objectContaining({ type: 'income', title: 'Salary', amount: 200000, createdAt: 'server-time' }),
    );
    expect(component.entry.type).toBe('expense');
  });
  it('edits legacy records as expenses without mutating the original and preserves income on edit', async () => {
    component.edit(legacy);
    expect(component.entry).toEqual({ ...legacy, type: 'expense' });
    component.entry.amount = 600;
    await component.save();
    expect(updateDoc).toHaveBeenCalledWith('document', { ...legacy, amount: 600, type: 'expense' });
    expect(legacy.amount).toBe(500);
    component.edit({ ...legacy, type: 'income' });
    expect(component.entry.type).toBe('income');
    component.reset();
    expect(component.editTargetId).toBeNull();
    expect(component.entry.type).toBe('expense');
  });
  it('retains confirmed deletion behavior', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await component.delete('old');
    expect(deleteDoc).not.toHaveBeenCalled();
    vi.mocked(window.confirm).mockReturnValue(true);
    await component.delete('old');
    expect(deleteDoc).toHaveBeenCalledWith('document');
  });
  it('sorts dates and numeric amounts without mutating stored order', () => {
    component.entryList = [
      { ...legacy, id: 'a', date: '2026-10-01', amount: 100 },
      { ...legacy, id: 'b', date: '2026-10-03', amount: -20 },
      { ...legacy, id: 'c', date: '2026-10-02', amount: 9 },
    ];
    for (const [order, ids] of [
      ['date-desc', ['b', 'c', 'a']], ['date-asc', ['a', 'c', 'b']],
      ['amount-desc', ['a', 'c', 'b']], ['amount-asc', ['b', 'c', 'a']],
    ] as const) {
      component.sortOrder = order;
      expect(component.sortedEntries.map(e => e.id)).toEqual(ids);
    }
    expect(component.entryList.map(e => e.id)).toEqual(['a', 'b', 'c']);
    component.entryList = [];
    expect(component.sortedEntries).toEqual([]);
  });

  it('changes visible order through the selector and edits the selected record', async () => {
    component.entryList = [
      { ...legacy, id: 'a', title: 'Large', amount: 100 },
      { ...legacy, id: 'b', title: 'Small', amount: 9 },
    ];
    fixture.changeDetectorRef.markForCheck(); fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('#entries-sort') as HTMLSelectElement;
    select.value = 'amount-asc'; select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.entry-card .entry-title').textContent).toContain('Small');
    fixture.nativeElement.querySelector('.entry-card .entry-actions button').click();
    expect(component.editTargetId).toBe('b');
  });

  it('does not overwrite creation time when editing', async () => {
    component.edit({ ...legacy, createdAt: { seconds: 100, nanoseconds: 0 } });
    await component.save();
    expect(updateDoc).toHaveBeenCalledWith('document', expect.not.objectContaining({ createdAt: expect.anything() }));
  });

  it('uses local dates initially and after save, preserving a manually selected date', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date(2026, 0, 1, 0, 30));
      const fresh = TestBed.createComponent(Entries).componentInstance;
      expect(fresh.entry.date).toBe('2026-01-01');
      fresh.entry.date = '2025-12-25';
      vi.setSystemTime(new Date(2026, 0, 2, 0, 30));
      await fresh.save();
      expect(addDoc).toHaveBeenCalledWith('entries', expect.objectContaining({ date: '2025-12-25' }));
      expect(fresh.entry.date).toBe('2026-01-02');
    } finally {
      vi.useRealTimers();
    }
  });

});
