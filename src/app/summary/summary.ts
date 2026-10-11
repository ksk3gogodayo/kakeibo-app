import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  type?: 'income' | 'expense';
}

interface BillingGroup {
  method: string;
  total: number;
  entries: Entry[];
  expanded: boolean;
}

interface DailyGroup {
  date: string;
  income: number;
  expense: number;
  balance: number;
  entries: Entry[];
  expanded: boolean;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary implements OnInit, OnDestroy {
  chart: Chart | null = null;
  allEntries: Entry[] = [];
  selectedMonth = currentMonth();
  billingGroups: BillingGroup[] = [];
  dailyGroups: DailyGroup[] = [];
  sortOrder = 'date-desc';

  get sortedDailyGroups(): DailyGroup[] {
    const [field, direction] = this.sortOrder.split('-');
    const sign = direction === 'asc' ? 1 : -1;
    return [...this.dailyGroups].sort((a, b) => {
      const comparison =
        field === 'income'
          ? a.income - b.income
          : field === 'expense'
            ? a.expense - b.expense
            : field === 'balance'
              ? a.balance - b.balance
              : a.date.localeCompare(b.date);
      return sign * comparison || b.date.localeCompare(a.date);
    });
  }
  viewMode: 'monthly' | 'daily' = 'monthly';
  private unsubscribe?: () => void;

  get t(): Translations {
    return this.langService.t;
  }

  get displayMonth(): string {
    const [y, m] = this.selectedMonth.split('-').map(Number);
    const date = new Date(y, m - 1);
    const locale =
      this.langService.lang === 'ja'
        ? 'ja-JP'
        : this.langService.lang === 'en'
          ? 'en-US'
          : 'fil-PH';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
  }

  get isCurrentMonth(): boolean {
    return this.selectedMonth === currentMonth();
  }

  get filteredEntries(): Entry[] {
    return this.allEntries.filter((e) => e.date?.startsWith(this.selectedMonth));
  }

  get expenseEntries(): Entry[] {
    return this.filteredEntries.filter((e) => e.type !== 'income');
  }

  get monthTotal(): number {
    return this.expenseEntries.reduce((sum, e) => sum + e.amount, 0);
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private langService: LangService,
  ) {}

  ngOnInit() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    this.unsubscribe = onSnapshot(collection(db, 'users', uid, 'entries'), (snapshot) => {
      this.allEntries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Entry[];
      this.refresh();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.unsubscribe?.();
    this.chart?.destroy();
  }

  setView(mode: 'monthly' | 'daily') {
    this.viewMode = mode;
    this.cdr.detectChanges();
    this.buildChart(this.filteredEntries.filter((e) => e.type !== 'income'));
  }

  toggleDay(group: DailyGroup) {
    group.expanded = !group.expanded;
  }

  displayDay(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    const locale =
      this.langService.lang === 'ja'
        ? 'ja-JP'
        : this.langService.lang === 'en'
          ? 'en-US'
          : 'fil-PH';
    return new Date(year, month - 1, day).toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
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
    const expenses = filtered.filter((e) => e.type !== 'income');
    this.buildBillingGroups(expenses);
    const expanded = new Set(this.dailyGroups.filter((g) => g.expanded).map((g) => g.date));
    const days = new Map<string, Entry[]>();
    for (const entry of filtered) {
      const items = days.get(entry.date) ?? [];
      items.push(entry);
      days.set(entry.date, items);
    }
    this.dailyGroups = [...days]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, entries]) => {
        const income = entries
          .filter((e) => e.type === 'income')
          .reduce((sum, e) => sum + e.amount, 0);
        const expense = entries
          .filter((e) => e.type !== 'income')
          .reduce((sum, e) => sum + e.amount, 0);
        return {
          date,
          entries,
          income,
          expense,
          balance: income - expense,
          expanded: expanded.has(date),
        };
      });
    // Render conditional canvases before Chart.js accesses them (including the first snapshot).
    this.cdr.detectChanges();
    this.buildChart(expenses);
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

    this.chart?.destroy();
    this.chart = null;
    if (this.viewMode !== 'monthly') return;

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
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#C9CBCF',
              '#7BC8A4',
            ],
          },
        ],
      },
      options: { responsive: true },
    });
  }
}
