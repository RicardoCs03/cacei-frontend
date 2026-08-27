import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CursoProfesorDetalles } from './curso-profesor-detalles';
import { CursoService } from '../../../../core/services/curso.service';
import { EvidenciaCatedraService } from '../../../../core/services/evidencia-catedra.service';
import { TipoInscripcionService } from '../../../../core/services/tipo-inscripcion.service';
import { CursoInscripcionesDTO } from '../../../../core/models/curso.inscripciones.model';

/**
 * Filtrado de la lista de alumnos inscritos.
 *
 * El filtro corre en el cliente sobre los datos ya cargados, así que se puede
 * comprobar sin levantar la API: basta con poner un detalle de curso conocido y
 * leer la lista que resulta.
 */
describe('CursoProfesorDetalles · filtros', () => {
  const DETALLE: CursoInscripcionesDTO = {
    curso: {
      id: 1,
      nombre: 'Fundamentos de Programación',
      programaEducativo: 'Ingeniería Informática',
      periodo: 'FEB 2026 - JUN 2026',
      fechaInicio: '2026-02-09',
      fechaFin: '2026-06-19',
    },
    inscripciones: [
      { id: 1, idAlumno: 10, matricula: 'DEMO010001', nombreCompleto: 'Lucía Aguilar Castillo', tipoInscripcion: 'ORDINARIA', calificacion: 9.6 },
      { id: 2, idAlumno: 11, matricula: 'DEMO010002', nombreCompleto: 'Miguel Díaz Jiménez', tipoInscripcion: 'ORDINARIA', calificacion: 7.2 },
      { id: 3, idAlumno: 12, matricula: 'DEMO010003', nombreCompleto: 'Ana Hernández Cruz', tipoInscripcion: 'RECURSAMIENTO', calificacion: 4.5 },
      { id: 4, idAlumno: 13, matricula: 'OTRO000004', nombreCompleto: 'Diego Aguilar Morales', tipoInscripcion: 'EXTRAORDINARIA', calificacion: 6.4 },
      { id: 5, idAlumno: 14, matricula: 'DEMO010005', nombreCompleto: 'Sofía Ramos Torres', tipoInscripcion: 'ORDINARIA', calificacion: null },
    ],
  };

  let componente: CursoProfesorDetalles;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CursoProfesorDetalles],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        {
          provide: CursoService,
          useValue: { getDetalleCurso: () => of(DETALLE) },
        },
        { provide: EvidenciaCatedraService, useValue: {} },
        {
          provide: TipoInscripcionService,
          useValue: { findAll: () => of(['ORDINARIA', 'EXTRAORDINARIA', 'RECURSAMIENTO']) },
        },
      ],
    });

    componente = TestBed.createComponent(CursoProfesorDetalles).componentInstance;
    componente.ngOnInit();
  });

  /** Matrículas de la lista visible, para comparar sin depender del orden. */
  const visibles = () => componente.inscripcionesFiltradas().map((i) => i.matricula);

  it('sin filtros muestra la lista completa', () => {
    expect(componente.filtroActivo()).toBe(false);
    expect(visibles()).toHaveLength(5);
  });

  it('filtra por matrícula parcial', () => {
    componente.filtroMatricula.set('DEMO0100');
    expect(visibles()).toHaveLength(4);
    expect(visibles()).not.toContain('OTRO000004');
  });

  it('filtra por nombre ignorando acentos y mayúsculas', () => {
    componente.filtroNombre.set('lucia');
    expect(visibles()).toEqual(['DEMO010001']);
  });

  it('busca el nombre también por apellido', () => {
    componente.filtroNombre.set('Aguilar');
    expect(visibles()).toHaveLength(2);
  });

  it('filtra por tipo de inscripción', () => {
    componente.filtroTipo.set('ORDINARIA');
    expect(visibles()).toEqual(['DEMO010001', 'DEMO010002', 'DEMO010005']);
  });

  it('filtra por rango de calificación e incluye los extremos', () => {
    componente.filtroCalifMin.set(6.4);
    componente.filtroCalifMax.set(9.6);
    expect(visibles()).toEqual(['DEMO010001', 'DEMO010002', 'OTRO000004']);
  });

  it('deja fuera a los alumnos sin calificación cuando hay rango', () => {
    componente.filtroCalifMin.set(0);
    componente.filtroCalifMax.set(10);
    expect(visibles()).not.toContain('DEMO010005');
  });

  it('acepta un rango abierto por un solo extremo', () => {
    componente.filtroCalifMax.set(6);
    expect(visibles()).toEqual(['DEMO010003']);
  });

  it('combina varios filtros a la vez', () => {
    componente.filtroMatricula.set('DEMO');
    componente.filtroTipo.set('ORDINARIA');
    componente.filtroCalifMin.set(8);
    expect(visibles()).toEqual(['DEMO010001']);
  });

  it('devuelve la lista vacía cuando nada coincide', () => {
    componente.filtroNombre.set('nombre inexistente');
    expect(visibles()).toHaveLength(0);
  });

  it('quitar filtros restaura la lista completa', () => {
    componente.filtroMatricula.set('DEMO');
    componente.filtroTipo.set('ORDINARIA');
    componente.filtroCalifMin.set(9);
    componente.filtroCalifMax.set(10);
    componente.filtroNombre.set('Lucía');
    expect(componente.filtroActivo()).toBe(true);

    componente.limpiarFiltros();

    expect(componente.filtroActivo()).toBe(false);
    expect(visibles()).toHaveLength(5);
  });

  it('los espacios sobrantes no cuentan como filtro', () => {
    componente.filtroNombre.set('   ');
    expect(componente.filtroActivo()).toBe(false);
    expect(visibles()).toHaveLength(5);
  });
});
