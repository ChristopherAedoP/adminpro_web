import { UsuarioService } from './../usuario/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class LoginGuardGuard implements CanActivate {
  constructor(public _router: Router, public _us: UsuarioService) {}

  canActivate(): boolean {
    if (this._us.estaLogueado()) {
      // console.log('paso el guard ');
      return true;
    } else {
      console.log('bloqueado por el Guard');
      this._router.navigate(['/login']);
      return false;
    }
  }
}
