import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoInputComponent } from './codigo-input.component';

describe('CodigoInputComponent', () => {
  let component: CodigoInputComponent;
  let fixture: ComponentFixture<CodigoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodigoInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
