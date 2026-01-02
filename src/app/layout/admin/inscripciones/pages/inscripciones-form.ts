import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from '../../../../core/models/alumno.model';
import { Curso } from '../../../../core/models/cursos.model';
import { Inscripcion } from '../../../../core/models/inscripcion.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { CursoService } from '../../../../core/services/curso.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  isEdit = false;

  constructor(
    private service: InscripcionService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.alumnoService.findAll().subscribe(d => this.alumnos = d);
    this.cursoService.findAll().subscribe(d => this.cursos = d);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.findById(+id).subscribe(d => this.inscripcion = d);
    }
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
