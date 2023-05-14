import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderDosComponent } from './slider-dos.component';

describe('SliderDosComponent', () => {
  let component: SliderDosComponent;
  let fixture: ComponentFixture<SliderDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderDosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
