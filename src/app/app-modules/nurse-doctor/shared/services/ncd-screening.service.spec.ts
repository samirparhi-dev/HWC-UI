import { TestBed, inject } from '@angular/core/testing';

import { NcdScreeningService } from './ncd-screening.service';

describe('NcdScreeningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NcdScreeningService]
    });
  });

  it('should be created', inject([NcdScreeningService], (service: NcdScreeningService) => {
    expect(service).toBeTruthy();
  }));
});
