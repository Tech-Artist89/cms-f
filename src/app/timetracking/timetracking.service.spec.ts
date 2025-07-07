import { TestBed } from '@angular/core/testing';

import { TimetrackingService } from './timetracking.service';

describe('TimetrackingService', () => {
  let service: TimetrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimetrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
