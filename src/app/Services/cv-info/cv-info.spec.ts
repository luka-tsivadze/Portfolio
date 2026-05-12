import { TestBed } from '@angular/core/testing';

import { CvInfo } from './cv-info';

describe('CvInfo', () => {
  let service: CvInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
