import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewProjectsComponent } from './preview-projects.component';

describe('PreviewProjectsComponent', () => {
  let component: PreviewProjectsComponent;
  let fixture: ComponentFixture<PreviewProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
