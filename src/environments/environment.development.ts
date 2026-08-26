/**
 * Configuración de desarrollo: `ng serve` en :4200 contra el backend en :9090.
 * El backend autoriza este origen mediante CACEI_CORS_ORIGENES.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9090/api',
};
