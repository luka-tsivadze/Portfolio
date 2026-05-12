import { TestBed } from '@angular/core/testing';

import { PlaygroundServ } from './playground-serv';

describe('PlaygroundServ', () => {
  let service: PlaygroundServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaygroundServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
