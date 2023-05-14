import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMensajeInformativoComponent } from './modal-mensaje-informativo.component';

describe('ModalMensajeInformativoComponent', () => {
  let component: ModalMensajeInformativoComponent;
  let fixture: ComponentFixture<ModalMensajeInformativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMensajeInformativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMensajeInformativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
