/**
 * Configuración de producción.
 *
 * El frontend se sirve con Nginx, que hace de proxy de `/api` hacia el backend
 * (ver devops/default.conf.template). Por eso la URL es relativa: el bundle no
 * lleva escrito ningún host y la misma imagen sirve para cualquier despliegue.
 */
export const environment = {
  production: true,
  apiUrl: '/api',
};
