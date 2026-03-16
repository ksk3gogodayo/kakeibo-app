import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface MasterData {
  categories: string[];
  paymentMethods: string[];
  billingMethods: string[];
}

export const MASTER_DEFAULTS: MasterData = {
  categories: ['食費', '日用品', '交通費', '外食', '娯楽', '医療', '通信', 'その他'],
  paymentMethods: ['現金', 'クレカ', '電子マネー', 'QRコード決済'],
  billingMethods: ['楽天カード', 'PayPay', '現金', 'その他'],
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  categories: string[] = [];
  paymentMethods: string[] = [];
  billingMethods: string[] = [];

  newCategory = '';
  newPaymentMethod = '';
  newBillingMethod = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = doc(db, 'users', uid, 'settings', 'master');
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as MasterData;
      this.categories = data.categories ?? [...MASTER_DEFAULTS.categories];
      this.paymentMethods = data.paymentMethods ?? [...MASTER_DEFAULTS.paymentMethods];
      this.billingMethods = data.billingMethods ?? [...MASTER_DEFAULTS.billingMethods];
    } else {
      this.categories = [...MASTER_DEFAULTS.categories];
      this.paymentMethods = [...MASTER_DEFAULTS.paymentMethods];
      this.billingMethods = [...MASTER_DEFAULTS.billingMethods];
      await this.persist();
    }
    this.cdr.detectChanges();
  }

  private async persist() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await setDoc(doc(db, 'users', uid, 'settings', 'master'), {
      categories: this.categories,
      paymentMethods: this.paymentMethods,
      billingMethods: this.billingMethods,
    });
  }

  async addItem(list: 'categories' | 'paymentMethods' | 'billingMethods', value: string) {
    const v = value.trim();
    if (!v || this[list].includes(v)) return;
    this[list] = [...this[list], v];
    if (list === 'categories') this.newCategory = '';
    if (list === 'paymentMethods') this.newPaymentMethod = '';
    if (list === 'billingMethods') this.newBillingMethod = '';
    await this.persist();
  }

  async deleteItem(list: 'categories' | 'paymentMethods' | 'billingMethods', index: number) {
    if (this[list].length <= 1) {
      alert('最低1つは必要です');
      return;
    }
    this[list] = this[list].filter((_, i) => i !== index);
    await this.persist();
  }
}
