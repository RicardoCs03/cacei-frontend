import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciasEducativasForm } from './experiencias-educativas-form';

describe('ExperienciasEducativasForm', () => {
  let component: ExperienciasEducativasForm;
  let fixture: ComponentFixture<ExperienciasEducativasForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienciasEducativasForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienciasEducativasForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
