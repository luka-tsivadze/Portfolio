import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgAnimator } from './bg-animator';

describe('BgAnimator', () => {
  let component: BgAnimator;
  let fixture: ComponentFixture<BgAnimator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgAnimator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgAnimator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
