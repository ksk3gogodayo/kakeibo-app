import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addDoc, collection, collectionGroup } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface Entry {
  id?: string;
  title: string;
  amount: number;
  category: string;
  paymentMethod: string;
  billingMethod: string;
  date: string;
}

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entries.html',
  styleUrl: './entries.scss',
})
export class Entries {
  entry: Entry = {
    title: '',
    amount: 0,
    category: '食費',
    paymentMethod: 'クレカ',
    billingMethod: '楽天カード',
    date: new Date().toISOString().split('T')[0],
  };

  categories = ['食費', '日用品', '交通費', '外食', '娯楽', '医療', '通信', 'その他'];
  paymentMethods = ['現金', 'クレカ', '電子マネー', 'QRコード決済'];
  billingMethods = ['楽天カード', 'PayPay', '現金', 'その他'];

  async save() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await addDoc(collection(db, 'users', uid, 'entries'), this.entry);
    alert('保存しました！');
    this.reset();
  }

  reset() {
    this.entry = {
      title: '',
      amount: 0,
      category: '食費',
      paymentMethod: 'クレカ',
      billingMethod: '楽天カード',
      date: new Date().toISOString().split('T')[0],
    };
  }
}
