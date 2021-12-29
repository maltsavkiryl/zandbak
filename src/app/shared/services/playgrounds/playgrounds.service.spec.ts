import { TestBed } from '@angular/core/testing';

import { PlaygroundsService } from './playgrounds.service';

describe('PlaygroundsService', () => {
  let service: PlaygroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaygroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
