import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

/**
 * El nombre que muestra la interfaz sale del token, que es la fuente autorizada
 * de la sesión activa. Estas pruebas cubren los tres casos posibles.
 */
describe('TokenService · nombre del usuario', () => {
  let servicio: TokenService;

  /** Arma un JWT de prueba: la firma no importa porque el cliente no la valida. */
  const token = (payload: Record<string, unknown>): string => {
    const parte = (o: unknown) =>
      btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${parte({ alg: 'HS384' })}.${parte(payload)}.firma-de-prueba`;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(TokenService);
    localStorage.clear();
  });

  it('toma el nombre completo del claim del token', () => {
    servicio.save(
      token({ sub: 'yberumen.demo@uv.mx', rol: 'PROFESOR', nombre: 'Yuliana Berumen Diaz' }),
      'PROFESOR',
      'Yuliana Berumen Diaz',
    );

    expect(servicio.getNombre()).toBe('Yuliana Berumen Diaz');
  });

  it('el token manda sobre la copia guardada si esta quedó desfasada', () => {
    servicio.save(
      token({ sub: 'yberumen.demo@uv.mx', rol: 'PROFESOR', nombre: 'Yuliana Berumen Diaz' }),
      'PROFESOR',
      'yberumen.demo@uv.mx', // valor viejo, de antes del cambio
    );

    expect(servicio.getNombre()).toBe('Yuliana Berumen Diaz');
  });

  it('usa la copia guardada cuando el token no trae el nombre', () => {
    servicio.save(token({ sub: 'rsolano.demo@uv.mx', rol: 'PROFESOR' }), 'PROFESOR', 'Rosa Isela Solano');

    expect(servicio.getNombre()).toBe('Rosa Isela Solano');
  });

  it('sin nombre por ningún lado, usa la parte del correo antes de la arroba', () => {
    servicio.save(token({ sub: 'rsolano.demo@uv.mx', rol: 'PROFESOR' }), 'PROFESOR', '');

    expect(servicio.getNombre()).toBe('rsolano.demo');
  });

  it('devuelve null cuando no hay sesión', () => {
    expect(servicio.getNombre()).toBeNull();
  });

  it('no confunde un token con formato inválido', () => {
    servicio.save('esto-no-es-un-jwt', 'PROFESOR', 'Respaldo');

    expect(servicio.getNombre()).toBe('Respaldo');
  });
});
