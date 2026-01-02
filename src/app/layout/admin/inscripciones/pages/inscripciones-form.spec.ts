import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionesForm } from './inscripciones-form';

describe('InscripcionesForm', () => {
  let component: InscripcionesForm;
  let fixture: ComponentFixture<InscripcionesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscripcionesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
