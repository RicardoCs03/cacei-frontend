import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionesList } from './inscripciones-list';

describe('InscripcionesList', () => {
  let component: InscripcionesList;
  let fixture: ComponentFixture<InscripcionesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscripcionesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
