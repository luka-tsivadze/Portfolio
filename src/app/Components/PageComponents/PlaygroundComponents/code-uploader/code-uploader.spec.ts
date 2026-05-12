import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeUploader } from './code-uploader';

describe('CodeUploader', () => {
  let component: CodeUploader;
  let fixture: ComponentFixture<CodeUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeUploader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
