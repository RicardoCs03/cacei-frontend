/**
 * Declaración de un filtro de listado.
 *
 * Cada pantalla describe qué se puede filtrar y de dónde sale el valor de cada
 * registro; el resto —pintar los controles y aplicar la combinación— lo resuelve
 * {@link FiltrosComponent} junto con `ListaBase`.
 */
export interface DefinicionFiltro<T> {
  /** Identificador interno del filtro. */
  clave: string;

  /** Etiqueta visible del control. */
  etiqueta: string;

  /**
   * `texto` para búsqueda parcial, `seleccion` para valores de catálogo y
   * `rango` para intervalos numéricos.
   */
  tipo: 'texto' | 'seleccion' | 'rango';

  /** Valor del registro sobre el que se compara. */
  valor: (item: T) => string | number | null | undefined;

  /**
   * Solo para `seleccion`. Si se omite, las opciones se deducen de los valores
   * presentes en la lista: así el desplegable nunca ofrece una opción que no
   * devolvería ningún resultado.
   */
  opciones?: string[];

  /** Texto que se muestra para cada opción, si difiere del valor almacenado. */
  etiquetaOpcion?: (valor: string) => string;

  /** Pista dentro del campo, para los filtros de texto. */
  ejemplo?: string;
}

/** Extremos de un filtro de rango. Ambos son opcionales por separado. */
export interface RangoFiltro {
  min: number | null;
  max: number | null;
}
