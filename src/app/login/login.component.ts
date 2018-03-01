import { Usuario } from './../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { element } from 'protractor';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  recuerdame: boolean = false;
  email: string;
  auth2: any;

  constructor(
    public _us: UsuarioService,
    public _router: Router ) { }

  ngOnInit() {
    init_plugins();
    this.googleLoginInit();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 0) {
      this.recuerdame = true;
    }
  }

  googleLoginInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
                        client_id: '72130390978-01rnoj6sntsf30c2diu40920tqnd6ur6.apps.googleusercontent.com',
                        cookiepolicy: 'single_host_origin',
                        scope: 'profile email'
                    });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin ( element: any ) {
    this.auth2.attachClickHandler( element , { }, (googleUser) => {

        // let profile = googleUser.getBasicProfile();
        // console.log(profile);
        let token = googleUser.getAuthResponse().id_token;
        // console.log(token);
        this._us.loginGoogle(token)
          .subscribe(resp => window.location.href = '#/dashboard' );
    });
  }

  ingresar(forma: NgForm) {

    // console.log(forma.valid);
    // console.log(forma.value);

    if (forma.invalid) {
      return;
    }

    let usuario = new Usuario(
      null,
      forma.value.email,
      forma.value.password
    );

    this._us.login (usuario , forma.value.recuerdame)
      .subscribe( resp => this._router.navigate(['/dashboard']));

  }
}
