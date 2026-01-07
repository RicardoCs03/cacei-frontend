import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtributosEgresoCheck } from './atributos-egreso-check';

describe('AtributosEgresoCheck', () => {
  let component: AtributosEgresoCheck;
  let fixture: ComponentFixture<AtributosEgresoCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtributosEgresoCheck]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtributosEgresoCheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
