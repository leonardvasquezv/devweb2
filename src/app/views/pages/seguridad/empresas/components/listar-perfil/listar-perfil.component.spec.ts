import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPerfilComponent } from './listar-perfil.component';

describe('ListarPerfilComponent', () => {
  let component: ListarPerfilComponent;
  let fixture: ComponentFixture<ListarPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
