import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from "@angular/platform-browser";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  label: string = '';

  constructor(
    public _router: Router ,
    public _titulo: Title,
    public _meta: Meta
  ) {
    console.log();

      this.getDataRoute()
        .subscribe( data => {
          // console.log(data);
          this.label = data.titulo;
          this._titulo.setTitle(this.label);

          let metatag: MetaDefinition = {
            name: 'description',
            content: this.label,

          };
          this._meta.updateTag(metatag);
        })

   }

  ngOnInit() {
  }

  getDataRoute() {
    return this._router.events
      .filter (evento => evento instanceof ActivationEnd )
      .filter ((evento: ActivationEnd) => evento.snapshot.firstChild === null )
      .map( (evento: ActivationEnd) => evento.snapshot.data )
  }
}
