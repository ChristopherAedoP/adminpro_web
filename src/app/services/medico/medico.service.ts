import { Medico } from './../../models/medico.model';
import { Usuario } from './../../models/usuario.model';
import { UsuarioService } from './../usuario/usuario.service';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MedicoService {
  constructor(public _http: HttpClient, public _us: UsuarioService) {}

  cargarMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + `/medico?desde=${desde}`;

    return this._http.get(url);
  }

  obtenerMedico(id: string) {
    let url = URL_SERVICIOS + `/medico/${id}`;

    return this._http.get(url);
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + `/medico/${id}?token=${this._us.token}`;
    return this._http.delete(url).map(resp => {
      swal(
        'Medico borrado',
        'El medico a sido eliminado correctamente',
        'success'
      );
      return true;
    });
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + `/medico`;

    if (medico._id) {
      // actualiza
      url += `/${medico._id}?token=${this._us.token}`;
      return this._http.put(url, medico).map((resp: any) => {
        swal('Medico actualizado', medico.nombre, 'success');
        return resp.medico;
      });
    } else {
      // crear
      url += `?token=${this._us.token}`;
      return this._http.post(url, medico).map((resp: any) => {
        swal('Medico creado', medico.nombre, 'success');
        return resp.medico;
      });
    }
  }

  buscarMedico(termino: string) {
    let url = URL_SERVICIOS + `/busqueda/coleccion/medicos/${termino}`;

    return this._http.get(url).map((resp: any) => resp.medicos);
  }

  actualizarMedico(medico: Medico) {
    let url = URL_SERVICIOS + `/medico/${medico._id}?token=${this._us.token}`;

    return this._http.put(url, medico).map((res: any) => {
      // if (medico._id === this.medico._id) {
      //   let usuarioDB: Usuario = res.usuario;
      //   this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
      // }

      swal('Medico actualizado', medico.nombre, 'success');
      return true;
    });
  }
}
