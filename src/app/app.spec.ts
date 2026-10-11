import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AppComponent } from './app';

vi.mock('firebase/firestore', () => ({ getFirestore: () => ({}) }));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  GoogleAuthProvider: class {},
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });
  it('creates the app and renders the loading state', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.loading')?.textContent).toContain(
      fixture.componentInstance.lang.t.loading,
    );
  });
});
