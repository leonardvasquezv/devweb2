import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-informacion-sg-sst',
  templateUrl: './informacion-sg-sst.component.html'
})
export class InformacionSGSSTComponent implements OnInit, OnDestroy {
  /**
   * Input que establece los inputs en modo consulta
   */
  @Input() modoConsulta = false;

  /**
   * Input para recibir el nombre del formulario
   */
  @Input() formGroupName: string;

  /**
   * Metodo que inicializa el formulario de datos basicos
   */
  public formConfiguracionEds: FormGroup;

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Metodo donde se inyectan las dependencias
   * @param _rootFormGroup formulario raiz
   */
  constructor(
    private _rootFormGroup: FormGroupDirective
  ) { }

  ngOnInit(): void {
    this.iniciarFormularios();
    this._cambiosCargaInicial();
  }

  /**
   * Metodo donde se destruye el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  /**
   * Metodo que inicializa los formularios
   */
  public iniciarFormularios(): void {
    if (this.formGroupName) {
      this.formConfiguracionEds = this._rootFormGroup.control.get(
        this.formGroupName
      ) as FormGroup;
    }
  }

  /**
   * Metodo que carga los datos iniciales
   */
   private _cambiosCargaInicial(): void {
    if (this.modoConsulta) this.formConfiguracionEds.disable();
  }
}
