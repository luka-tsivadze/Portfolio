import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAboutBenefits } from './app-about-benefits';

describe('AppAboutBenefits', () => {
  let component: AppAboutBenefits;
  let fixture: ComponentFixture<AppAboutBenefits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAboutBenefits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAboutBenefits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
