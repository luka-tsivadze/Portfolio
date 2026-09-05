import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewHomeComponent } from './preview-home.component';

describe('PreviewHomeComponent', () => {
  let component: PreviewHomeComponent;
  let fixture: ComponentFixture<PreviewHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
