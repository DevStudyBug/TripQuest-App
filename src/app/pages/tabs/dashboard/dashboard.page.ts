import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { UIToastService } from 'src/app/core/service/ui.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  private uiToast = inject(UIToastService);

  stats: any = null;
  isLoading = false;

  @ViewChild('categoryChart', { static: false }) categoryChartRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    // Chart will be created after data is loaded
  }

  private loadStats() {
    this.isLoading = true;
    this.dashboardService.getUserStats().subscribe({
      next: (s) => {
        this.stats = s;
        this.isLoading = false;
        // render chart if canvas exists
        setTimeout(() => this.renderChart(), 0);
      },
      error: () => {
        this.isLoading = false;
        this.uiToast.showToast('Failed to load dashboard', 2000, 'danger');
      }
    });
  }

  private renderChart() {
    try {
      const map = this.stats?.tripsByCategory || {};
      const labels = Object.keys(map);
      const values = labels.map(l => map[l] || 0);

      if (!this.categoryChartRef) return;

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.categoryChartRef.nativeElement.getContext('2d')!, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data: values,
            // backgroundColor are default palette — don't force specific colors
            backgroundColor: [
              'rgba(54,162,235,0.8)',
              'rgba(255,99,132,0.8)',
              'rgba(255,205,86,0.8)',
              'rgba(75,192,192,0.8)',
              'rgba(153,102,255,0.8)',
              'rgba(201,203,207,0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    } catch (e) {
      console.warn('Chart render failed', e);
    }
  }
}
