import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from '../../../../core/models/cursos.model';
import { Inscripcion } from '../../../../core/models/inscripcion.model';
import { CursoService } from '../../../../core/services/curso.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { CommonModule } from '@angular/common';
import { CursoInscripcionesDTO } from '../../../../core/models/curso.inscripciones.model'; 

@Component({
  selector: 'app-curso-profesor-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curso-profesor-detalles.html',
  styleUrl: './curso-profesor-detalles.css',
})
export class CursoProfesorDetalles implements OnInit {

  cursoIns?: CursoInscripcionesDTO;
  curso?: Curso;
  

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
  
  ) {
    console.log('CursoProfesorDetalles component loaded');
  }

  ngOnInit(): void {
    const cursoId = Number(this.route.snapshot.paramMap.get('id'));

    this.cursoService.findById(cursoId)
      .subscribe(c => this.curso = c);

    this.cursoService.getDetalleCurso(cursoId)
      .subscribe(d => this.cursoIns = d);
  }

  exportarPdf(): void {
    console.log('Generar PDF CACEI');
  }
  
}
