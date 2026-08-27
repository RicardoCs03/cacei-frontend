import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaEducativoFormComponent } from './programas-educativos-form';

describe('ProgramaEducativoFormComponent', () => {
  let component: ProgramaEducativoFormComponent;
  let fixture: ComponentFixture<ProgramaEducativoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramaEducativoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaEducativoFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
