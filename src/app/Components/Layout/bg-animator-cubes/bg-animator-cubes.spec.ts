import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgAnimatorCubes } from './bg-animator-cubes';

describe('BgAnimatorCubes', () => {
  let component: BgAnimatorCubes;
  let fixture: ComponentFixture<BgAnimatorCubes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgAnimatorCubes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgAnimatorCubes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
