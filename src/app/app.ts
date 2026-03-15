import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Entries } from './entries/entries';
import { Summary } from './summary/summary';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, Entries, Summary], // ← Summaryを追加
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  user: User | null = null;
  loading = true;

  constructor(private cdr: ChangeDetectorRef) {
    onAuthStateChanged(auth, (u) => {
      this.user = u;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  async logout() {
    await signOut(auth);
  }
}
