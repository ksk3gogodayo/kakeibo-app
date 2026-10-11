import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Entries } from './entries';

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'test-user' } }),
  GoogleAuthProvider: class {},
}));
vi.mock('firebase/firestore', () => ({
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
      expect.objectContaining({ type: 'income', title: 'Salary', amount: 200000 }),
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
});
