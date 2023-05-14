import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTresComponent } from './slider-tres.component';

describe('SliderTresComponent', () => {
  let component: SliderTresComponent;
  let fixture: ComponentFixture<SliderTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderTresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
