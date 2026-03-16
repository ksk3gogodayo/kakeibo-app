import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MASTER_DEFAULTS } from '../settings/settings';
import { LangService } from '../lang.service';
import { Translations } from '../i18n';

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

  get t(): Translations {
    return this.langService.t;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private langService: LangService,
  ) {}

  ngOnInit() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

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

  edit(e: Entry) {
    this.editTargetId = e.id!;
    this.entry = { ...e };
    this.cdr.detectChanges();
  }

  async save() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (this.editTargetId) {
      const ref = doc(db, 'users', uid, 'entries', this.editTargetId);
      await updateDoc(ref, { ...this.entry });
      alert(this.t.msgUpdated);
      this.editTargetId = null;
    } else {
      await addDoc(collection(db, 'users', uid, 'entries'), this.entry);
      alert(this.t.msgSaved);
    }
    this.reset();
  }

  exportCsv() {
    const header = ['日付', '品名', '金額', 'カテゴリ', '決済方法', '引き落とし方法'];
    const rows = [...this.entryList]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => [e.date, e.title, e.amount, e.category, e.paymentMethod, e.billingMethod]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kakeibo_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async delete(id: string) {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    if (!confirm(this.t.msgConfirmDelete)) return;
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
