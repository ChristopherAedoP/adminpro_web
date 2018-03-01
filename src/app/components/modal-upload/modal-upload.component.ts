import { Usuario } from '../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public _cas: SubirArchivoService,
    public _mus: ModalUploadService
  ) {
    // console.log('modal listo');
  }

  ngOnInit() {}

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      swal(
        'Solo imágenes',
        'El archivo seleccionado no es una imagen',
        'error'
      );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => (this.imagenTemp = reader.result);
  }

  subirImagen() {
    this._cas
      .subirArchivo(this.imagenSubir, this._mus.tipo, this._mus.id)
      .then(resp => {
        console.log(resp);
        this._mus.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch(err => console.log('error carga.. ', err));
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this._mus.ocultarModal();
  }
}
