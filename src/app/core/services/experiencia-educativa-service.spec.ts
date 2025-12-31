import { TestBed } from '@angular/core/testing';

import { ExperienciaEducativaService } from './experiencia-educativa-service';

describe('ExperienciaEducativaService', () => {
  let service: ExperienciaEducativaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExperienciaEducativaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
