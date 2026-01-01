import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from '../../../../core/models/alumno.model';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private alumnoService: AlumnoService,
    private programaService: ProgramaEducativoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.programaService.findAll().subscribe(data => {
      this.programas = data;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.alumnoService.findById(+id).subscribe(data => {
        this.alumno = data;
        console.log("Datos del alumno a editar:"+this.alumno.nombre);
      });
    }
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
