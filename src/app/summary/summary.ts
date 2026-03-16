import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Chart, registerables } from 'chart.js';
import { LangService } from '../lang.service';
import { Translations } from '../i18n';

Chart.register(...registerables);

interface Entry {
  id?: string;
  title: string;
  amount: number;
  category: string;
  billingMethod: string;
  date: string;
}

interface BillingGroup {
  method: string;
  total: number;
  entries: Entry[];
  expanded: boolean;
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary implements OnInit {
  chart: Chart | null = null;
  allEntries: Entry[] = [];
  selectedMonth = new Date().toISOString().slice(0, 7);
  billingGroups: BillingGroup[] = [];

  get t(): Translations {
    return this.langService.t;
  }

  get displayMonth(): string {
    const [y, m] = this.selectedMonth.split('-').map(Number);
    const date = new Date(y, m - 1);
    const locale =
      this.langService.lang === 'ja' ? 'ja-JP'
      : this.langService.lang === 'en' ? 'en-US'
      : 'fil-PH';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
  }

  get isCurrentMonth(): boolean {
    return this.selectedMonth === new Date().toISOString().slice(0, 7);
  }

  get filteredEntries(): Entry[] {
    return this.allEntries.filter((e) => e.date?.startsWith(this.selectedMonth));
  }

  get monthTotal(): number {
    return this.filteredEntries.reduce((sum, e) => sum + e.amount, 0);
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private langService: LangService,
  ) {}

  ngOnInit() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    onSnapshot(collection(db, 'users', uid, 'entries'), (snapshot) => {
      this.allEntries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Entry[];
      this.refresh();
      this.cdr.detectChanges();
    });
  }

  prevMonth() {
    const [y, m] = this.selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 2);
    this.selectedMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    this.refresh();
    this.cdr.detectChanges();
  }

  nextMonth() {
    const [y, m] = this.selectedMonth.split('-').map(Number);
    const d = new Date(y, m);
    this.selectedMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    this.refresh();
    this.cdr.detectChanges();
  }

  toggleGroup(index: number) {
    this.billingGroups[index].expanded = !this.billingGroups[index].expanded;
  }

  private refresh() {
    const filtered = this.filteredEntries;
    this.buildChart(filtered);
    this.buildBillingGroups(filtered);
  }

  private buildBillingGroups(entries: Entry[]) {
    const map = new Map<string, Entry[]>();
    entries.forEach((e) => {
      const key = e.billingMethod || 'その他';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });

    const prevExpanded = new Map(this.billingGroups.map((g) => [g.method, g.expanded]));

    this.billingGroups = Array.from(map.entries())
      .map(([method, items]) => ({
        method,
        total: items.reduce((sum, e) => sum + e.amount, 0),
        entries: [...items].sort((a, b) => a.date.localeCompare(b.date)),
        expanded: prevExpanded.get(method) ?? false,
      }))
      .sort((a, b) => b.total - a.total);
  }

  private buildChart(entries: Entry[]) {
    const categoryTotals: { [key: string]: number } = {};
    entries.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (this.chart) this.chart.destroy();

    const canvas = document.getElementById('summaryChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
              '#9966FF', '#FF9F40', '#C9CBCF', '#7BC8A4',
            ],
          },
        ],
      },
      options: { responsive: true },
    });
  }
}
