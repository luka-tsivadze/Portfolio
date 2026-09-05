import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAboutDecisions } from './app-about-decisions';

describe('AppAboutDecisions', () => {
  let component: AppAboutDecisions;
  let fixture: ComponentFixture<AppAboutDecisions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAboutDecisions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAboutDecisions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
