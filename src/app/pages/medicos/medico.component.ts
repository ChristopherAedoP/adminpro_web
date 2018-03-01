import { Hospital } from '../../models/hospital.model';
import { MedicoService } from './../../services/medico/medico.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];

  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public _hs: HospitalService,
    public _ms: MedicoService,
    public _router: Router,
    public _actRout: ActivatedRoute,
    public _mus: ModalUploadService
  ) {
    _actRout.params.subscribe(params => {
      let id = params['id'];
      // console.log(id);
      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this._hs
      .cargarHospitales()
      .subscribe((resp: any) => (this.hospitales = resp.hospitales));

    this._mus.notificacion.subscribe(resp => {
      // console.log('cambio imagen', resp);
      this.medico.img = resp.medico.img;
    });
  }

  guardarMedico(f: NgForm) {
    // console.log(f.valid);
    // console.log(f.value);

    if (f.invalid) {
      return;
    }

    this._ms.guardarMedico(this.medico).subscribe(medico => {
      // console.log(medico);

      this.medico._id = medico._id;

      this._router.navigate(['/medico', medico._id]);
    });
  }

  cambioHospital(id: string) {
    console.log(id);
    this._hs.obtenerHospital(id).subscribe((datos: any) => {
      // console.log(datos);
      this.hospital = datos.hospital;
    });
  }

  cargarMedico(id: string) {
    this._ms.obtenerMedico(id).subscribe((resp: any) => {
      // console.log(resp);
      this.medico = resp.medico;
      this.medico.hospital = resp.medico.hospital._id;
      this.cambioHospital(resp.medico.hospital);
    });
  }

  cambiarFoto(id: string) {
    this._mus.mostarModal('medicos', this.medico._id);
  }
}
