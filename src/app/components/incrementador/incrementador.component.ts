
import { Component, Input, Output, EventEmitter, ViewChild, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;
  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number  = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    // console.log('leyenda' , this.leyenda);
    // console.log('progreso' , this.progreso);
   }

  ngOnInit() {
    // console.log('leyenda' , this.leyenda);
    // console.log('progreso' , this.progreso);
  }
  onChanges(nuevoValor: number) {

    // let elemHTML: any = document.getElementsByName('progreso')[0];
    // console.log(this.txtProgress);
    if (this.progreso >= 100) {
      this.progreso = 100;

    }else  if (nuevoValor <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    this.txtProgress.nativeElement.value = this.progreso;
    this.txtProgress.nativeElement.focus();
    this.cambioValor.emit(this.progreso);

  }

  cambiarValor ( valor: number ) {
    if (this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      return;
    }
    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + valor;

    this.cambioValor.emit(this.progreso);

  }

}
