import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizacionTipoDetalleComponent } from './parametrizacion-tipo-detalle.component';

describe('ParametrizacionTipoDetalleComponent', () => {
  let component: ParametrizacionTipoDetalleComponent;
  let fixture: ComponentFixture<ParametrizacionTipoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrizacionTipoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrizacionTipoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
