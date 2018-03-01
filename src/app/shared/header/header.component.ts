import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from './../../services/service.index';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;

  constructor(public _us: UsuarioService, public _router: Router) {}

  ngOnInit() {
    this.usuario = this._us.usuario;
  }

  buscar(termino) {
    this._router.navigate(['/busqueda', termino]);
  }
}
