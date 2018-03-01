import { Observable } from 'rxjs/Observable';
import { URL_SERVICIOS } from './../../config/config';
import * as swal from 'sweetalert';
import { Usuario } from './../../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any = [];
  constructor(
    public _router: Router,
    public _http: HttpClient,
    public _sas: SubirArchivoService
  ) {
    this.cargarDelStorage();
  }
  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + `/login`;

    return this._http
      .post(url, usuario)
      .map((resp: any) => {
        // console.log(resp);
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
      .catch(err => {
        // console.log(err.error.mensaje);
        swal('Error en el login', err.error.mensaje, 'error');
        return Observable.throw(err);
      });
  }

  loginGoogle(token) {
    let url = URL_SERVICIOS + `/login/google`;

    return this._http
      .post(url, { token })
      .map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
      .catch(err => {
        // console.log(err.error.mensaje);
        swal('Error en el login', err.error.mensaje, 'error');
        return Observable.throw(err);
      });
  }

  estaLogueado() {
    return this.token.length > 5 ? true : false;
  }

  cargarDelStorage() {
    if (localStorage.getItem('token')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.token = localStorage.getItem('token');
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.usuario = null;
      this.token = '';
      this.menu = [];
    }
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this._router.navigate(['/login']);
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + `/usuario`;

    return this._http
      .post(url, usuario)
      .map((resp: any) => {
        swal('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      })
      .catch(err => {
        // console.log(err.error.mensaje);
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return Observable.throw(err);
      });
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + `/usuario/${usuario._id}?token=${this.token}`;

    return this._http
      .put(url, usuario)
      .map((res: any) => {
        if (usuario._id === this.usuario._id) {
          let usuarioDB: Usuario = res.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }

        swal('Usuario actualizado', usuario.nombre, 'success');
        return true;
      })
      .catch(err => {
        // console.log(err.error.mensaje);
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return Observable.throw(err);
      });
  }

  cambiarImagen(archivo: File, id: string) {
    this._sas
      .subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        swal('Imagen Actualizada', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      })
      .catch(resp => {
        console.log('err', resp);
      });
  }

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + `/usuario?desde=${desde}`;

    return this._http.get(url);
  }

  buscarUsuario(termino: string) {
    let url = URL_SERVICIOS + `/busqueda/coleccion/usuarios/${termino}`;

    return this._http.get(url).map((resp: any) => resp.usuarios);
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + `/usuario/${id}?token=${this.token}`;
    return this._http.delete(url).map(resp => {
      swal(
        'Usuario borrado',
        'El usuario a sido eliminado correctamente',
        'success'
      );
      return true;
    });
  }

  renuevaToken() {
    let url = URL_SERVICIOS + `/login/renuevatoken?token=${this.token}`;

    return this._http
      .get(url)
      .map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        console.log('Token Renovado');
        return true;
      })
      .catch(err => {
        this._router.navigate(['/login']);
        swal(
          'No e pudo renovsr el token',
          'no fue posible recuperar el token',
          'error'
        );
        return Observable.throw(err);
      });
  }
}
