import { UsuarioService } from './../usuario/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class VerificaTokenGuard implements CanActivate {
  constructor(public _us: UsuarioService, public _router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    // console.log('verificaToken');

    let token = this._us.token;
    let payload = JSON.parse(atob(token.split('.')[1]));
    // console.log(payload);

    let expirado = this.expirado(payload.exp);

    if (expirado) {
      // expirado
      this._router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date(fechaExp * 1000);
      let ahora = new Date();

      ahora.setTime(ahora.getTime() + 4 * 60 * 60 * 1000);

      // console.log(tokenExp);
      // console.log(ahora);

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this._us.renuevaToken().subscribe(
          () => {
            resolve(true);
          },
          () => {
            this._router.navigate(['/login']);
            reject(false);
          }
        );
      }
    });
  }
  expirado(fechaExp: number) {
    let ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      // expirado
      return true;
    } else {
      return false;
    }
  }
}
