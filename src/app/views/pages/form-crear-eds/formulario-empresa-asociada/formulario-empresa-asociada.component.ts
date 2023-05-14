import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ETipo } from '@core/enum/tipo.enum';
import { tipoDocumento } from '@core/enum/tipoDocumento.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { SortUtils } from '@core/utils/sort-utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario-empresa-asociada',
  templateUrl: './formulario-empresa-asociada.component.html'
})
export class FormularioEmpresaAsociadaComponent implements OnInit, OnDestroy {
  /**
   * Input que establece los inputs en modo consulta
   */
  @Input() modoConsulta: boolean = false;

  /**
   * Input para recibir el nombre del formulario
   */
  @Input() formGroupName: string;

  /**
    * Metodo que inicializa el formulario de datos basicos
    */
  public formEmpresaAsociadaEDS: FormGroup;

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Tipos de documento
   */
  public tiposDeDocumentos: Array<TipoDetalle>;

  /**
   * Metodo donde se inyectan las dependencias
   * @param _rootFormGroup formulario raiz
   * @param _tipoParametrizacionModel inyeccion de los servicios de TipoParametrizacionModel
   *
   */
  constructor(
    private _tipoParametrizacionModel: TipoParametrizacionModel,
    private _rootFormGroup: FormGroupDirective
  ) { }

  /**
   * Metodo donde se inicializa el componente
   */
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
      this.formEmpresaAsociadaEDS = this._rootFormGroup.control.get(
        this.formGroupName
      ) as FormGroup;
    }
  }

  /**
   * Metodo que carga los datos iniciales
   */
   private _cambiosCargaInicial(): void {
    if (this.modoConsulta) this.formEmpresaAsociadaEDS.disable();

    const criterioTipoDocumento = [{ campo: 'idTipo', valor: ETipo.tiposDeDocumentos }];
    this._tipoParametrizacionModel.obtenerTiposParametrizacion(criterioTipoDocumento).subscribe(({ data }: ResponseWebApi) => {
      return this.tiposDeDocumentos = SortUtils.getSortJson(data, 'nombre', 'STRING')
    });
  }
  /**
   *  Método donde validamos el numero de documento
   */
  public validarNumeroDocumento(): void {
    const _tipoDocumento=this.formEmpresaAsociadaEDS.get('idTipoDeDocumento').value
    const nomeclaturatipoDocumento:TipoDetalle=this.tiposDeDocumentos.find(x=>x.idTipoDetalle==_tipoDocumento)
    const numeroDocumento:string=this.formEmpresaAsociadaEDS.get('numeroDocumento').value
    const countNumeroDocumento=!!numeroDocumento?numeroDocumento.length:0
    if (!numeroDocumento) return 
    switch (nomeclaturatipoDocumento?.nomenclatura??'A') {
      case tipoDocumento.CedulaCiudadania:
        if (countNumeroDocumento>=10) this.formEmpresaAsociadaEDS.get('numeroDocumento').patchValue(numeroDocumento.substring(0,10))
        break;
      case tipoDocumento.CedulaExtranjeria:
        if (countNumeroDocumento>=6) this.formEmpresaAsociadaEDS.get('numeroDocumento').patchValue(numeroDocumento.substring(0,6))
        break;
      case tipoDocumento.Nit:
        if (countNumeroDocumento>=11) this.formEmpresaAsociadaEDS.get('numeroDocumento').patchValue(numeroDocumento.substring(0,11))
        break;
      case tipoDocumento.Pasaporte:
        if (countNumeroDocumento>=9) this.formEmpresaAsociadaEDS.get('numeroDocumento').patchValue(numeroDocumento.substring(0,9))
        break;
      default:
        this.formEmpresaAsociadaEDS.get('numeroDocumento').patchValue(numeroDocumento.substring(0,10))
      break;
    }
  }

}
