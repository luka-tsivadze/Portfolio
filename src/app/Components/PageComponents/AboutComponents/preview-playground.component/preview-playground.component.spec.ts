import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPlaygroundComponent } from './preview-playground.component';

describe('PreviewPlaygroundComponent', () => {
  let component: PreviewPlaygroundComponent;
  let fixture: ComponentFixture<PreviewPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewPlaygroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
