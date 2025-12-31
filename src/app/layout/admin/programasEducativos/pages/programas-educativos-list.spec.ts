import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramasEducativosList } from './programas-educativos-list';

describe('ProgramasEducativosList', () => {
  let component: ProgramasEducativosList;
  let fixture: ComponentFixture<ProgramasEducativosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramasEducativosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramasEducativosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
