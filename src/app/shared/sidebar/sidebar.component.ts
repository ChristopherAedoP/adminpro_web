import { Usuario } from './../../models/usuario.model';

import { Component, OnInit } from '@angular/core';

import { SidebarService, UsuarioService } from './../../services/service.index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;

  constructor(public _us: UsuarioService, public _sidebar: SidebarService) {}

  ngOnInit() {
    this.usuario = this._us.usuario;
    this._sidebar.cargarMenu();
  }
}
