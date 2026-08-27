import { forkJoin, of } from 'rxjs';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from '../../../../core/models/alumno.model';
import { Curso } from '../../../../core/models/cursos.model';
import { Inscripcion } from '../../../../core/models/inscripcion.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { CursoService } from '../../../../core/services/curso.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { TipoInscripcionService } from '../../../../core/services/tipo-inscripcion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';

@Component({
  selector: 'app-inscripciones-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './inscripciones-form.html',
  styleUrl: './inscripciones-form.css',
})
export class InscripcionesForm implements OnInit {
  inscripcion: Inscripcion = {
    id: undefined,
    idAlumno: undefined,
    idCurso: undefined,
    calificacion: 0,
    tipoInscripcion: '',
    fecInscripcion: '',
    isActive: true
  };

  alumnos: Alumno[] = [];
  cursos: Curso[] = [];
  /** Catalogo de tipos de inscripcion: antes se capturaba como texto libre. */
  tipos: string[] = [];
  isEdit = false;

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private service: InscripcionService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private tipoInscripcionService: TipoInscripcionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    // Los dos catalogos y el registro se resuelven juntos: la inscripcion llega
    // antes que las listas y, sin esperar, los desplegables quedaban en blanco.
    forkJoin({
      alumnos: this.alumnoService.findAll(),
      cursos: this.cursoService.findAll(),
      tipos: this.tipoInscripcionService.findAll(),
      inscripcion: id ? this.service.findById(+id) : of(null),
    }).subscribe({
      next: ({ alumnos, cursos, tipos, inscripcion }) => {
        this.alumnos = alumnos ?? [];
        this.cursos = cursos ?? [];
        this.tipos = tipos ?? [];
        if (inscripcion) {
          this.inscripcion = { ...this.inscripcion, ...inscripcion };
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
    if (this.isEdit && this.inscripcion.id) {
      this.service.update(this.inscripcion.id, this.inscripcion)
        .subscribe(() => this.router.navigate(['/admin/inscripciones']));
    } else {
      this.service.create(this.inscripcion)
        .subscribe(() => this.router.navigate(['/admin/inscripciones']));
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/inscripciones']);
  }

}
