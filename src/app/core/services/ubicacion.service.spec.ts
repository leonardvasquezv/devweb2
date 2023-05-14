import { TestBed } from '@angular/core/testing';
import { UbicacionService } from './ubicacion.service';
import { ObjParam } from 'src/app/core/interfaces/base/objParam.interface';
import { HttpClientModule } from '@angular/common/http';

describe('UbicacionService', () => {
  let service: UbicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        UbicacionService
      ],
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(UbicacionService);
  });

  it('Se debe traer el listado de los ', () => {
    expect(service).toBeTruthy();
  });

  it('#obtenerDepartamentos debe retornar el array de departamentos', (done: DoneFn) => {
    let Criterios:Array<ObjParam>=[
      {campo:'IdPais',        valor: 1 },
      {campo:'EstadoRegistro',valor:'A'}
    ]
    service.obtenerDepartamentos(Criterios).subscribe(value=>{
      const {message,data}=value
      expect(message).toBe('Operación Exitosa');
      expect(data).not.toBeNull();
      done();
    })
  });
});
