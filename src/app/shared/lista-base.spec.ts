import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { ListaBase } from './lista-base';
import { DefinicionFiltro } from './filtros/filtro.model';

interface Registro {
  matricula: string;
  nombre: string;
  programa: string;
  creditos: number | null;
}

const REGISTROS: Registro[] = [
  { matricula: 'S22010001', nombre: 'Lucía Aguilar Castillo', programa: 'Ingeniería Informática', creditos: 8 },
  { matricula: 'S22010002', nombre: 'Miguel Díaz Jiménez', programa: 'Ingeniería Informática', creditos: 6 },
  { matricula: 'S22020003', nombre: 'Ana Hernández Cruz', programa: 'Ingeniería Mecánica Eléctrica', creditos: 10 },
  { matricula: 'S22020004', nombre: 'Diego Aguilar Morales', programa: 'Ingeniería Mecánica Eléctrica', creditos: null },
];

/** Listado de prueba con un filtro de cada tipo. */
class ListadoDePrueba extends ListaBase<Registro> {
  protected override get entidad(): string {
    return 'registros';
  }

  protected override consultar(): Observable<Registro[]> {
    return of(REGISTROS);
  }

  override get filtros(): DefinicionFiltro<Registro>[] {
    return [
      { clave: 'matricula', etiqueta: 'Matrícula', tipo: 'texto', valor: (r) => r.matricula },
      { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', valor: (r) => r.nombre },
      { clave: 'programa', etiqueta: 'Programa', tipo: 'seleccion', valor: (r) => r.programa },
      { clave: 'creditos', etiqueta: 'Créditos', tipo: 'rango', valor: (r) => r.creditos },
    ];
  }
}

/**
 * Filtrado compartido de los listados.
 *
 * Los siete paneles de administración y el del profesor usan este mismo
 * mecanismo, así que estas pruebas cubren el comportamiento de todos.
 */
describe('ListaBase · filtros', () => {
  let listado: ListadoDePrueba;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    listado = TestBed.runInInjectionContext(() => new ListadoDePrueba());
    listado.cargar();
  });

  const visibles = () => listado.datosFiltrados().map((r) => r.matricula);

  it('sin filtros muestra todo', () => {
    expect(listado.filtroActivo()).toBe(false);
    expect(visibles()).toHaveLength(4);
  });

  it('filtra por texto parcial', () => {
    listado.cambiarFiltroTexto('matricula', 'S2201');
    expect(visibles()).toEqual(['S22010001', 'S22010002']);
  });

  it('el texto ignora acentos y mayúsculas', () => {
    listado.cambiarFiltroTexto('nombre', 'lucia');
    expect(visibles()).toEqual(['S22010001']);
  });

  it('filtra por selección con coincidencia exacta', () => {
    listado.cambiarFiltroTexto('programa', 'Ingeniería Informática');
    expect(visibles()).toEqual(['S22010001', 'S22010002']);
  });

  it('deduce las opciones de selección de los datos, sin repetir y ordenadas', () => {
    expect(listado.opcionesFiltros()['programa']).toEqual([
      'Ingeniería Informática',
      'Ingeniería Mecánica Eléctrica',
    ]);
  });

  it('no genera opciones para los filtros que no son de selección', () => {
    expect(listado.opcionesFiltros()['nombre']).toBeUndefined();
  });

  it('filtra por rango incluyendo los extremos', () => {
    listado.cambiarFiltroRango('creditos', 'min', 6);
    listado.cambiarFiltroRango('creditos', 'max', 8);
    expect(visibles()).toEqual(['S22010001', 'S22010002']);
  });

  it('acepta un rango abierto por un extremo', () => {
    listado.cambiarFiltroRango('creditos', 'min', 9);
    expect(visibles()).toEqual(['S22020003']);
  });

  it('excluye los registros sin dato cuando el rango está activo', () => {
    listado.cambiarFiltroRango('creditos', 'min', 0);
    expect(visibles()).not.toContain('S22020004');
  });

  it('combina filtros de distinto tipo', () => {
    listado.cambiarFiltroTexto('nombre', 'aguilar');
    listado.cambiarFiltroTexto('programa', 'Ingeniería Informática');
    listado.cambiarFiltroRango('creditos', 'min', 7);
    expect(visibles()).toEqual(['S22010001']);
  });

  it('marca que no hay coincidencias sin confundirlo con lista vacía', () => {
    listado.cambiarFiltroTexto('nombre', 'no existe');
    expect(visibles()).toHaveLength(0);
    expect(listado.sinCoincidencias).toBe(true);
    expect(listado.sinContenido).toBe(false);
  });

  it('quitar filtros devuelve la lista completa', () => {
    listado.cambiarFiltroTexto('matricula', 'S2201');
    listado.cambiarFiltroRango('creditos', 'max', 8);
    expect(listado.filtroActivo()).toBe(true);

    listado.limpiarFiltros();

    expect(listado.filtroActivo()).toBe(false);
    expect(visibles()).toHaveLength(4);
  });

  it('los espacios en blanco no cuentan como filtro', () => {
    listado.cambiarFiltroTexto('nombre', '   ');
    expect(listado.filtroActivo()).toBe(false);
    expect(visibles()).toHaveLength(4);
  });

  it('vaciar un filtro reactiva los registros que había ocultado', () => {
    listado.cambiarFiltroTexto('matricula', 'S2202');
    expect(visibles()).toHaveLength(2);

    listado.cambiarFiltroTexto('matricula', '');
    expect(visibles()).toHaveLength(4);
  });
});
