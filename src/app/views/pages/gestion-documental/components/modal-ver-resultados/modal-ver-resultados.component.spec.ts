import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerResultadosComponent } from './modal-ver-resultados.component';

describe('ModalVerResultadosComponent', () => {
  let component: ModalVerResultadosComponent;
  let fixture: ComponentFixture<ModalVerResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerResultadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVerResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
