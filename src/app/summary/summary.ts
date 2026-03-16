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
  date: string;
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
    const ref = collection(db, 'users', uid, 'entries');
    onSnapshot(ref, (snapshot) => {
      const entries = snapshot.docs.map((d) => d.data()) as Entry[];
      this.buildChart(entries);
      this.cdr.detectChanges();
    });
  }

  buildChart(entries: Entry[]) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const filtered = entries.filter((e) => e.date?.startsWith(currentMonth));

    const categoryTotals: { [key: string]: number } = {};
    filtered.forEach((e) => {
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
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#C9CBCF',
            ],
          },
        ],
      },
      options: { responsive: true },
    });
  }
}
