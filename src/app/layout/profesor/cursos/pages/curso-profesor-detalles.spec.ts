import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoProfesorDetalles } from './curso-profesor-detalles';

describe('CursoProfesorDetalles', () => {
  let component: CursoProfesorDetalles;
  let fixture: ComponentFixture<CursoProfesorDetalles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoProfesorDetalles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoProfesorDetalles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
