import { TestBed } from '@angular/core/testing';

import { ProgramaEducativoService } from './programa-educativo.service';

describe('ProgramaEducativoService', () => {
  let service: ProgramaEducativoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramaEducativoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
