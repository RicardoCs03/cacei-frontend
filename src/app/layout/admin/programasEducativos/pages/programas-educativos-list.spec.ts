import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaEducativoListComponent } from './programas-educativos-list';

describe('ProgramaEducativoListComponent', () => {
  let component: ProgramaEducativoListComponent;
  let fixture: ComponentFixture<ProgramaEducativoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramaEducativoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaEducativoListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
