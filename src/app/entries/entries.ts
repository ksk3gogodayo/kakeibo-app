import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MASTER_DEFAULTS } from '../settings/settings';

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
export class Entries implements OnInit {
  entry: Entry = {
    title: '',
    amount: 0,
    category: MASTER_DEFAULTS.categories[0],
    paymentMethod: MASTER_DEFAULTS.paymentMethods[0],
    billingMethod: MASTER_DEFAULTS.billingMethods[0],
    date: new Date().toISOString().split('T')[0],
  };

  editTargetId: string | null = null;
  entryList: Entry[] = [];
  categories: string[] = [...MASTER_DEFAULTS.categories];
  paymentMethods: string[] = [...MASTER_DEFAULTS.paymentMethods];
  billingMethods: string[] = [...MASTER_DEFAULTS.billingMethods];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // マスターデータをリアルタイムで読み込む
    onSnapshot(doc(db, 'users', uid, 'settings', 'master'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        this.categories = data['categories'] ?? [...MASTER_DEFAULTS.categories];
        this.paymentMethods = data['paymentMethods'] ?? [...MASTER_DEFAULTS.paymentMethods];
        this.billingMethods = data['billingMethods'] ?? [...MASTER_DEFAULTS.billingMethods];
        this.cdr.detectChanges();
      }
    });

    onSnapshot(collection(db, 'users', uid, 'entries'), (snapshot) => {
      this.entryList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Entry[];
      this.cdr.detectChanges();
    });
  }

  // 編集ボタンを押した時
  edit(e: Entry) {
    this.editTargetId = e.id!;
    this.entry = { ...e };
    this.cdr.detectChanges();
  }

  async save() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (this.editTargetId) {
      // 編集モード → 上書き保存
      const ref = doc(db, 'users', uid, 'entries', this.editTargetId);
      await updateDoc(ref, { ...this.entry });
      alert('更新しました！');
      this.editTargetId = null;
    } else {
      // 新規保存
      await addDoc(collection(db, 'users', uid, 'entries'), this.entry);
      alert('保存しました！');
    }
    this.reset();
  }

  async delete(id: string) {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    if (!confirm('削除しますか？')) return;
    await deleteDoc(doc(db, 'users', uid, 'entries', id));
  }

  reset() {
    this.entry = {
      title: '',
      amount: 0,
      category: this.categories[0] ?? '',
      paymentMethod: this.paymentMethods[0] ?? '',
      billingMethod: this.billingMethods[0] ?? '',
      date: new Date().toISOString().split('T')[0],
    };
    this.editTargetId = null;
  }
}
