import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  // Doughnut
  @Input() public ChartLabels: string[] = [];
  @Input() public ChartData: number[] = [];
  @Input() public ChartType: string = '';

  constructor() { }

  ngOnInit() {
  }

}
