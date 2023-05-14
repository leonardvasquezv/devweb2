import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInformacionEmpresaComponent } from './formulario-informacion-empresa.component';

describe('FormularioInformacionEmpresaComponent', () => {
  let component: FormularioInformacionEmpresaComponent;
  let fixture: ComponentFixture<FormularioInformacionEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioInformacionEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioInformacionEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
