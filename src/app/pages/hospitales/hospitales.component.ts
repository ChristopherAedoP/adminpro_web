import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { HospitalService } from './../../services/service.index';
import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
// import * as swal from 'sweetalert';
declare const swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargado: boolean = true;
  bloqueaBoton: boolean = false;
  constructor(public _hs: HospitalService, public _mus: ModalUploadService) {}

  ngOnInit() {
    this.cargarHospitales();
    this._mus.notificacion.subscribe(resp => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargado = true;
    this._hs.cargarHospitales(this.desde).subscribe((resp: any) => {
      // console.log(resp);

      this.hospitales = resp.hospitales;
      this.totalRegistros = resp.total;
      this.cargado = false;
    });
  }
  mostrarModal(id: string) {
    this._mus.mostarModal('hospitales', id);
  }
  crearHospital() {
    swal({
      title: 'Nuevo Hospital',
      text: 'Ingrese nombre para el nuevo hospital.',
      content: 'input',
      button: {
        text: 'Crear',
        closeModal: false
      },
      icon: 'info',
      dangerMode: true
    })
      .then(nombre => {
        if (!nombre) {
          throw null;
        }

        this._hs.crearHospital(nombre).subscribe(resp => {
          this.cargarHospitales();
        });
      })
      .catch(err => {
        if (err) {
          swal('Error', 'No se creo el nuevo hospital.', 'error');
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
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
    this.cargarHospitales();
  }

  guardarHospital(hospital: Hospital) {
    this._hs.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._hs.borrarHospital(hospital._id).subscribe(borrado => {
          console.log(borrado);
          this.desde = 0;
          this.cargarHospitales();
        });
      }
    });
  }
  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      this.bloqueaBoton = false;
      return;
    }
    this.bloqueaBoton = true;
    this._hs.buscarHospital(termino).subscribe((resp: any) => {
      // console.log('buscarHospital', resp);

      this.hospitales = resp;
      this.totalRegistros = this.hospitales.length;
      this.cargado = false;
    });

    // this.cargado = true;
  }
}
