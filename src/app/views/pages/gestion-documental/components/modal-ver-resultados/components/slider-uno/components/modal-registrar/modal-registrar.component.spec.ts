import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistrarComponent } from './modal-registrar.component';

describe('ModalRegistrarComponent', () => {
  let component: ModalRegistrarComponent;
  let fixture: ComponentFixture<ModalRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRegistrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
