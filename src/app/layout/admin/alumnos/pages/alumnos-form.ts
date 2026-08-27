import { forkJoin, of } from 'rxjs';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from '../../../../core/models/alumno.model';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';

@Component({
  selector: 'app-alumnos-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './alumnos-form.html',
  styleUrl: './alumnos-form.css',
})
export class AlumnosForm implements OnInit{

  alumno: Alumno = {
    matricula: '',
    nombre: '',
    apepat: '',
    apemat: '',
    programaEducativo: '',
    isActive: true
  };

  programas: ProgramaEducativo[] = [];
  isEdit = false;

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private alumnoService: AlumnoService,
    private programaService: ProgramaEducativoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    // El catalogo y el registro se resuelven juntos: si el alumno se asignara
    // antes de que el desplegable tenga opciones, no habria valor con el que
    // emparejar y el campo saldria vacio.
    forkJoin({
      programas: this.programaService.findAll(),
      alumno: id ? this.alumnoService.findById(+id) : of(null),
    }).subscribe({
      next: ({ programas, alumno }) => {
        this.programas = programas ?? [];
        if (alumno) {
          this.alumno = { ...this.alumno, ...alumno };
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
    if (this.isEdit && this.alumno.id) {
      this.alumnoService.update(this.alumno.id, this.alumno)
        .subscribe(() => this.router.navigate(['/admin/alumnos']));
    } else {
      this.alumnoService.create(this.alumno)
        .subscribe(() => this.router.navigate(['/admin/alumnos']));
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/alumnos']);
  }

}
