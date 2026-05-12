import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Skilaxy } from './skilaxy';

describe('Skilaxy', () => {
  let component: Skilaxy;
  let fixture: ComponentFixture<Skilaxy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skilaxy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Skilaxy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
