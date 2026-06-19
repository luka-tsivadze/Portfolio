import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clobe } from './clobe';

describe('Clobe', () => {
  let component: Clobe;
  let fixture: ComponentFixture<Clobe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clobe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clobe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
