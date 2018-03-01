import { Usuario } from './../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
// import * as swal from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare const swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargado: boolean = true;

  constructor(public _us: UsuarioService, public _mus: ModalUploadService) {}

  ngOnInit() {
    this.cargarUsuarios();

    this._mus.notificacion.subscribe(resp => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargado = true;
    this._us.cargarUsuarios(this.desde).subscribe((resp: any) => {
      // console.log(resp);

      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargado = false;
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargado = true;
    this._us.buscarUsuario(termino).subscribe((usuario: Usuario[]) => {
      // console.log(usuario);

      this.usuarios = usuario;
      this.totalRegistros = this.usuarios.length;
      this.cargado = false;
    });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._us.usuario._id) {
      swal(
        'No puede borrar el usuario',
        'No se puede borrar asi mismo',
        'error'
      );
      return;
    }

    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._us.borrarUsuario(usuario._id).subscribe(borrado => {
          console.log(borrado);
          this.desde = 0;
          this.cargarUsuarios();
        });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._us.actualizarUsuario(usuario).subscribe();
  }

  mostrarModal(id: string) {
    this._mus.mostarModal('usuarios', id);
  }
}
