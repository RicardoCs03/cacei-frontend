import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramasEducativosForm } from './programas-educativos-form';

describe('ProgramasEducativosForm', () => {
  let component: ProgramasEducativosForm;
  let fixture: ComponentFixture<ProgramasEducativosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramasEducativosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramasEducativosForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
