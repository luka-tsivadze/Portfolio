import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSkillsComponent } from './preview-skills.component';

describe('PreviewSkillsComponent', () => {
  let component: PreviewSkillsComponent;
  let fixture: ComponentFixture<PreviewSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewSkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
