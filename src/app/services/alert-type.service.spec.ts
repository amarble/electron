import { TestBed, inject } from '@angular/core/testing';

import { AlertTypeService } from './alert-type.service';

describe('AlertTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertTypeService]
    });
  });

  it('should be created', inject([AlertTypeService], (service: AlertTypeService) => {
    expect(service).toBeTruthy();
  }));
});
