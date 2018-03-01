import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { MedicoService } from './../../services/service.index';
import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
// import * as swal from 'sweetalert';
declare const swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargado: boolean = true;
  bloqueaBoton: boolean = false;
  constructor(public _hs: MedicoService, public _mus: ModalUploadService) {}

  ngOnInit() {
    this.cargarMedicos();
    this._mus.notificacion.subscribe(resp => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargado = true;
    this._hs.cargarMedicos(this.desde).subscribe((resp: any) => {
      // console.log(resp);

      this.medicos = resp.medicos;
      this.totalRegistros = resp.total;
      this.cargado = false;
    });
  }
  mostrarModal(id: string) {
    this._mus.mostarModal('medicos', id);
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    // console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }

  guardarMedico(medico: Medico) {
    this._hs.actualizarMedico(medico).subscribe();
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._hs.borrarMedico(medico._id).subscribe(borrado => {
          console.log(borrado);
          this.desde = 0;
          this.cargarMedicos();
        });
      }
    });
  }
  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      this.bloqueaBoton = false;
      return;
    }
    this.bloqueaBoton = true;
    this._hs.buscarMedico(termino).subscribe((resp: any) => {
      // console.log('buscarMedico', resp);

      this.medicos = resp;
      this.totalRegistros = this.medicos.length;
      this.cargado = false;
    });

    // this.cargado = true;
  }
}
