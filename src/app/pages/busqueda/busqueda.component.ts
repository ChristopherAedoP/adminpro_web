import { Medico } from './../../models/medico.model';
import { Usuario } from './../../models/usuario.model';
import { URL_SERVICIOS } from './../../config/config';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {
  usuarios: Usuario[] = [];
  hospitales: Hospital[] = [];
  medicos: Medico[] = [];

  constructor(public _actroute: ActivatedRoute, public _http: HttpClient) {
    this._actroute.params.subscribe(params => {
      let termino = params['termino'];
      // console.log(termino);
      this.buscar(termino);
    });
  }

  ngOnInit() {}

  buscar(termino: string) {
    let url = URL_SERVICIOS + `/busqueda/todo/${termino}`;

    this._http.get(url).subscribe((resp: any) => {
      // console.log(resp);
      this.usuarios = resp.usuarios;
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;
    });
  }
}
