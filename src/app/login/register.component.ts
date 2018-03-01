
import { Component, OnInit, group } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { log } from 'util';

import * as swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public _us: UsuarioService,
    public _router: Router
  ) { }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required ),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required ),
      password2: new FormControl(null, Validators.required ),
      condiciones: new FormControl(false )
    } , { validators: this.sonIguales('password', 'password2')  });


    this.forma.setValue({
      nombre : 'Test 1',
      correo: 'correo@correo.com',
      password: '123456',
      password2: '123456',
      condiciones: true,
    });
  }
  registroUsuario() {

    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.condiciones) {
      console.log('Debe de aceptar las condiciones');
      swal('Importante' , 'Debe de aceptar las condiciones', 'warning');
      return;
    }

    // console.log('forma valid', this.forma.valid);
    // console.log('forma', this.forma.value);

    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._us.crearUsuario(usuario)
      .subscribe( resp => this._router.navigate(['/login']));

  }

  sonIguales(campo1: string , campo2: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return ( group: FormGroup) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }
      return {
        sonIguales: true
      };
    };
  }
}
