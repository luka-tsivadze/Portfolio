import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Textanimator } from './textanimator';

describe('Textanimator', () => {
  let component: Textanimator;
  let fixture: ComponentFixture<Textanimator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textanimator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Textanimator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
