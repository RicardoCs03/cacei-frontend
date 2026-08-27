import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { LoginResponse } from '../../core/models/auth.model';

describe('LoginComponent · indicador de carga', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let componente: LoginComponent;
  let respuesta: Subject<LoginResponse>;
  let navegado: string | null;

  const RESPUESTA: LoginResponse = {
    token: 'token-de-prueba',
    role: 'PROFESOR',
    nombre: 'Yuliana Berumen Díaz',
    expiraEnSegundos: 28800,
  };

  function preparar(falla = false) {
    respuesta = new Subject<LoginResponse>();
    navegado = null;

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: () => (falla ? throwError(() => ({ status: 401 })) : respuesta.asObservable()),
            rutaInicio: () => '/profesor',
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: (url: string) => {
              navegado = url;
              return Promise.resolve(true);
            },
          },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    componente = fixture.componentInstance;
    componente.email = 'yberumen.demo@uv.mx';
    componente.password = 'Profesor123*';
  }

  const html = () => (fixture.nativeElement as HTMLElement).innerHTML;

  it('no muestra el indicador antes de enviar', () => {
    preparar();
    fixture.detectChanges();

    expect(componente.enviando()).toBe(false);
    expect(html()).toContain('Entrar');
    expect(html()).not.toContain('animate-spin');
  });

  it('muestra el indicador mientras se verifican las credenciales', () => {
    preparar();
    fixture.detectChanges();

    componente.login();
    fixture.detectChanges();

    expect(componente.enviando()).toBe(true);
    expect(html()).toContain('animate-spin');
    expect(html()).toContain('Entrando…');
  });

  it('deshabilita el botón mientras envía, para no duplicar la petición', () => {
    preparar();
    fixture.detectChanges();

    componente.login();
    fixture.detectChanges();

    const boton = (fixture.nativeElement as HTMLElement).querySelector('button[type="submit"]');
    expect(boton?.hasAttribute('disabled')).toBe(true);
  });

  it('retira el indicador y muestra el error si las credenciales fallan', () => {
    preparar(true);
    fixture.detectChanges();

    componente.login();
    fixture.detectChanges();

    expect(componente.enviando()).toBe(false);
    expect(html()).not.toContain('animate-spin');
    expect(componente.error()).toContain('incorrect');
  });

  it('al entrar correctamente navega y deja de mostrar el indicador', () => {
    preparar();
    fixture.detectChanges();

    componente.login();
    expect(componente.enviando()).toBe(true);

    respuesta.next(RESPUESTA);
    respuesta.complete();
    fixture.detectChanges();

    expect(componente.enviando()).toBe(false);
    expect(navegado).toBe('/profesor');
  });
});
