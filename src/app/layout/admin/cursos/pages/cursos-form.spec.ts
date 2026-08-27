import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CursosForm } from './cursos-form';
import { CursoService } from '../../../../core/services/curso.service';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Curso } from '../../../../core/models/cursos.model';

/**
 * Carga del formulario de edición de un curso.
 *
 * El fallo que motivó estas pruebas: el curso y los catálogos se pedían por
 * separado y el curso llegaba primero, así que al asignar `idEE` los desplegables
 * aún no tenían opciones y el formulario aparecía vacío. Ahora las tres consultas
 * se resuelven juntas.
 */
describe('CursosForm · carga para editar', () => {
  const CURSO: Curso = {
    id: 30,
    idProfesor: 1,
    idEE: 4,
    nrc: 'D10104',
    nombreEE: 'Bases de Datos',
    fechaAsignacion: '2026-01-20',
    fechaInicio: '2026-02-09',
    fechaFin: '2026-06-19',
    periodo: 'FEB 2026 - JUN 2026',
    horasSemana: 5,
    hora: '09:00-11:00',
    salon: 'DEMO-A102',
  };

  const EXPERIENCIAS = [
    { id: 1, nombre: 'Fundamentos de Programación' },
    { id: 4, nombre: 'Bases de Datos' },
  ];

  const PROFESORES = [
    { id: 1, idUsuario: 2, nombre: 'Yuliana', apepat: 'Berumen', apemat: 'Díaz', matricula: 'DEMO-PROF-01' },
    { id: 2, idUsuario: 3, nombre: 'Rosa Isela', apepat: 'Solano', apemat: 'Pérez', matricula: 'DEMO-PROF-02' },
  ];

  /** Reproduce el orden real: el curso responde antes que los catálogos. */
  function configurar(retrasoCatalogos: number) {
    TestBed.configureTestingModule({
      imports: [CursosForm],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '30' } } } },
        { provide: Router, useValue: { navigate: () => {} } },
        {
          provide: CursoService,
          useValue: { findById: (): Observable<Curso> => of(CURSO) },
        },
        {
          provide: ExperienciaEducativaService,
          useValue: { findAll: () => of(EXPERIENCIAS).pipe(delay(retrasoCatalogos)) },
        },
        {
          provide: UsuarioService,
          useValue: { findProfesores: () => of(PROFESORES).pipe(delay(retrasoCatalogos)) },
        },
      ],
    });

    return TestBed.createComponent(CursosForm).componentInstance;
  }

  it('espera a los catálogos antes de dar por cargado el formulario', async () => {
    const componente = configurar(20);
    componente.ngOnInit();

    // Mientras los catálogos no lleguen, la pantalla sigue en estado de carga.
    expect(componente.cargando()).toBe(true);
    expect(componente.experiencias).toHaveLength(0);

    await new Promise((r) => setTimeout(r, 60));

    expect(componente.cargando()).toBe(false);
    expect(componente.experiencias).toHaveLength(2);
    expect(componente.profesores).toHaveLength(2);
  });

  it('deja los desplegables con un valor que existe entre las opciones', async () => {
    const componente = configurar(20);
    componente.ngOnInit();
    await new Promise((r) => setTimeout(r, 60));

    // Esto es lo que fallaba: el valor se asignaba cuando no había opción que lo
    // igualara, y el <select> se quedaba en blanco.
    expect(componente.curso.idEE).toBe(4);
    expect(componente.experiencias.some((e) => e.id === componente.curso.idEE)).toBe(true);

    expect(componente.curso.idProfesor).toBe(1);
    expect(componente.profesores.some((p) => p.id === componente.curso.idProfesor)).toBe(true);
  });

  it('rellena el resto de los campos del curso', async () => {
    const componente = configurar(10);
    componente.ngOnInit();
    await new Promise((r) => setTimeout(r, 50));

    expect(componente.curso.periodo).toBe('FEB 2026 - JUN 2026');
    expect(componente.curso.salon).toBe('DEMO-A102');
    expect(componente.curso.hora).toBe('09:00-11:00');
    expect(componente.curso.horasSemana).toBe(5);
    // Las fechas deben venir en formato yyyy-MM-dd o el <input type="date"> las ignora.
    expect(componente.curso.fechaInicio).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(componente.curso.fechaFin).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(componente.curso.fechaAsignacion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('marca el formulario como edición cuando la ruta trae id', () => {
    const componente = configurar(0);
    componente.ngOnInit();
    expect(componente.isEdit).toBe(true);
  });
});
