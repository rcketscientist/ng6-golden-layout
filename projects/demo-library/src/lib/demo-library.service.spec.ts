import { TestBed } from '@angular/core/testing';

import { DemoLibraryService } from './demo-library.service';

describe('DemoLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemoLibraryService = TestBed.get(DemoLibraryService);
    expect(service).toBeTruthy();
  });
});
