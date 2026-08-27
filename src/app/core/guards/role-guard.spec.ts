import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';

import { roleGuard } from './role-guard';
import { TokenService } from '../services/token.service';

describe('roleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    localStorage.clear();
  });

  /** El guard es una fábrica: recibe el rol y devuelve el CanActivateFn. */
  const ejecutar = (rol: 'ADMINISTRADOR' | 'PROFESOR', url = '/admin/usuarios') =>
    TestBed.runInInjectionContext(() =>
      roleGuard(rol)({} as never, { url } as never),
    );

  const sesion = (rol: 'ADMINISTRADOR' | 'PROFESOR') =>
    TestBed.inject(TokenService).save('token-de-prueba', rol, 'Persona de prueba');

  it('deja pasar cuando el rol coincide', () => {
    sesion('PROFESOR');
    expect(ejecutar('PROFESOR', '/profesor/cursos')).toBe(true);
  });

  it('manda a la pantalla de acceso denegado cuando el rol no alcanza', () => {
    sesion('PROFESOR');
    const resultado = ejecutar('ADMINISTRADOR', '/admin/usuarios');

    expect(resultado).toBeInstanceOf(UrlTree);
    expect((resultado as UrlTree).toString()).toContain('/acceso-denegado');
  });

  it('no deja la ruta solicitada en la dirección', () => {
    sesion('PROFESOR');
    const resultado = ejecutar('ADMINISTRADOR', '/admin/usuarios') as UrlTree;

    // Ni en la URL ni en la pantalla: no hay por que confirmar la seccion.
    expect(resultado.queryParams['intento']).toBeUndefined();
    expect(resultado.toString()).not.toContain('usuarios');
  });

  it('manda al login cuando no hay sesión, no a acceso denegado', () => {
    const resultado = ejecutar('PROFESOR') as UrlTree;

    // Sin sesión el problema es de autenticación, no de permisos.
    expect(resultado.toString()).toContain('/login');
    expect(resultado.queryParams['returnUrl']).toBe('/admin/usuarios');
  });
});
