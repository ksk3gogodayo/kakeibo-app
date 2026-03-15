import { Component } from '@angular/core';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  async loginWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Googleログイン失敗:', error);
    }
  }
}
