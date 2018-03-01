import { Usuario } from './../../models/usuario.model';
import { UsuarioService } from './../usuario/usuario.service';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../../models/hospital.model';

@Injectable()
export class HospitalService {
  constructor(public _http: HttpClient, public _us: UsuarioService) {}

  cargarHospitales(desde: number = 0) {
    let url = URL_SERVICIOS + `/hospital?desde=${desde}`;

    return this._http.get(url);
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + `/hospital/${id}`;

    return this._http.get(url);
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + `/hospital/${id}?token=${this._us.token}`;
    return this._http.delete(url).map(resp => {
      swal(
        'Hospital borrado',
        'El hospital a sido eliminado correctamente',
        'success'
      );
      return true;
    });
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + `/hospital?token=${this._us.token}`;

    return this._http.post(url, { nombre }).map((resp: any) => {
      swal('Hospital creado', nombre, 'success');
      return resp.hospital;
    });
  }

  buscarHospital(termino: string) {
    let url = URL_SERVICIOS + `/busqueda/coleccion/hospitales/${termino}`;

    return this._http.get(url).map((resp: any) => resp.hospitales);
  }

  actualizarHospital(hospital: Hospital) {
    let url =
      URL_SERVICIOS + `/hospital/${hospital._id}?token=${this._us.token}`;

    return this._http.put(url, hospital).map((res: any) => {
      // if (hospital._id === this.hospital._id) {
      //   let usuarioDB: Usuario = res.usuario;
      //   this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
      // }

      swal('Hospital actualizado', hospital.nombre, 'success');
      return true;
    });
  }
}
