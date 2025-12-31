import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciaEducativaList } from './experiencia-educativa-list';

describe('ExperienciaEducativaList', () => {
  let component: ExperienciaEducativaList;
  let fixture: ComponentFixture<ExperienciaEducativaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienciaEducativaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienciaEducativaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
