import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { CursoService } from '../../../../core/services/curso.service';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Curso } from '../../../../core/models/cursos.model';
import { ExperienciaEducativa } from '../../../../core/models/experienciaEducativa.model';
import { ProfesorOpcion } from '../../../../core/models/usuario.model';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';

@Component({
  selector: 'app-cursos-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos-form.html',
  styleUrl: './cursos-form.css',
})
export class CursosForm implements OnInit {
  curso: Curso = {
    fechaAsignacion: '',
    fechaInicio: '',
    fechaFin: '',
    periodo: '',
    horasSemana: 0,
    hora: '',
    salon: '',
  };

  experiencias: ExperienciaEducativa[] = [];
  profesores: ProfesorOpcion[] = [];

  isEdit = false;

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  private readonly cursoService = inject(CursoService);
  private readonly experienciaService = inject(ExperienciaEducativaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    // Las tres consultas se resuelven juntas a proposito.
    //
    // Antes cada una iba por su cuenta y el curso llegaba antes que los
    // catalogos; al asignar curso.idEE los <select> aun no tenian <option>, asi
    // que no habia valor con el que emparejar y el formulario se veia vacio.
    forkJoin({
      experiencias: this.experienciaService.findAll(),
      profesores: this.usuarioService.findProfesores(),
      curso: id ? this.cursoService.findById(+id) : of(null),
    }).subscribe({
      next: ({ experiencias, profesores, curso }) => {
        this.experiencias = experiencias ?? [];
        this.profesores = profesores ?? [];

        // El curso se asigna al final, cuando los desplegables ya tienen opciones.
        if (curso) {
          this.curso = curso;
        }

        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  save(): void {
    if (this.guardando()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const peticion =
      this.isEdit && this.curso.id
        ? this.cursoService.update(this.curso.id, this.curso)
        : this.cursoService.create(this.curso);

    peticion.subscribe({
      next: () => this.router.navigate(['/admin/cursos']),
      error: (err) => {
        this.guardando.set(false);
        this.error.set(mensajeDeError(err));
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/cursos']);
  }
}
