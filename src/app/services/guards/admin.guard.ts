import { UsuarioService } from './../usuario/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(public _us: UsuarioService) {}

  canActivate() {
    if (this._us.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.log('bloqueado por el AdminGuard');
      this._us.logout();
      return false;
    }
  }
}
