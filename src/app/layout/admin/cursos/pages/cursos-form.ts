import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../../../core/services/curso.service';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Curso } from '../../../../core/models/cursos.model';
import { ExperienciaEducativa } from '../../../../core/models/experienciaEducativa.model';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-cursos-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos-form.html',
  styleUrl: './cursos-form.css',
})
export class CursosForm {


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
  profesores: Usuario[] = [];

  isEdit = false;

   constructor(
    private cursoService: CursoService,
    private experienciaService: ExperienciaEducativaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.experienciaService.findAll().subscribe(e => this.experiencias = e);
    this.usuarioService.findProfesores().subscribe(p => this.profesores = p);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cursoService.findById(+id).subscribe(data => {
        this.curso = data;
      });
    }
  }

  save(): void {
    if (this.isEdit && this.curso.id) {
      this.cursoService.update(this.curso.id, this.curso)
        .subscribe(() => this.router.navigate(['/admin/cursos']));
    } else {
      this.cursoService.create(this.curso)
        .subscribe(() => this.router.navigate(['/admin/cursos']));
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/cursos']);
  }

}
