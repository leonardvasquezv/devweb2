import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-estado-registro',
  templateUrl: './modal-estado-registro.component.html',
  styleUrls: ['./modal-estado-registro.component.scss']
})
export class ModalEstadoRegistroComponent implements OnInit {

  /**
   * Atributo que contiene el formulario de estado de registro
   */
  public formGroupEstadoRegistro: FormGroup;

  /**
   * metodo constructo encargado de construir el componente de estado de registro
   * @param _formBuilder define las configuraciones de la construccion del formulairo
   * @param data enviada desdel llamado padre
   * @param dialogRef hace referencia a las configuraciones del dialogoF
   */
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>
  ) { }

  /**
   * get utilizado para obtener el titulo del modal
   */
  get labelModal() {
    if(this.data.titulo)
      return this.data.titulo;
    else
      return this.data.estado ? 'Activar' : 'Inactivar';
  }

  /**
   * metodo encargado de inicializar el componente de modal de estado de regustro
   */
  ngOnInit(): void {
    this.iniciarFormularios();
  }

  /**
   * Metodo encargado de emitir el valor al componente padre una vez validado el formulario
   */
  public guardar(): void {
    if (this.formGroupEstadoRegistro.valid) {
      this.dialogRef.close({ data: this.formGroupEstadoRegistro.value });
    }
  }

  /**
   * Inicializa las propiedades de los campos de los formularios utilizados
   */
  private iniciarFormularios(): void {
    this.formGroupEstadoRegistro = this._formBuilder.group({
      observacionEstado: ['', Validators.compose([Validators.required])]
    });
  }

}
