import { TestBed } from '@angular/core/testing';

import { AtributoEgresoService } from './atributo-egreso-service';

describe('AtributoEgresoService', () => {
  let service: AtributoEgresoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtributoEgresoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
