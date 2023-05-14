import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderUnoComponent } from './slider-uno.component';

describe('SliderUnoComponent', () => {
  let component: SliderUnoComponent;
  let fixture: ComponentFixture<SliderUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderUnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
