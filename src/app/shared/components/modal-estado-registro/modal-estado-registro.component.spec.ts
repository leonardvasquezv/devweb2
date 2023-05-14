import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEstadoRegistroComponent } from './modal-estado-registro.component';

describe('ModalEstadoRegistroComponent', () => {
  let component: ModalEstadoRegistroComponent;
  let fixture: ComponentFixture<ModalEstadoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEstadoRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEstadoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
