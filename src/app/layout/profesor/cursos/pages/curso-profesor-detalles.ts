import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from '../../../../core/models/cursos.model';
import { Inscripcion } from '../../../../core/models/inscripcion.model';
import { CursoService } from '../../../../core/services/curso.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { EvidenciaCatedraService } from '../../../../core/services/evidencia-catedra.service';
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
  cursoId!: number;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private evidenciaCatedraService: EvidenciaCatedraService,

  ) {
    console.log('CursoProfesorDetalles component loaded');
  }

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));

    this.cursoService.findById(this.cursoId)
      .subscribe(c => this.curso = c);

    this.cursoService.getDetalleCurso(this.cursoId)
      .subscribe(d => this.cursoIns = d);
  }

  exportarPdf(): void {
    this.evidenciaCatedraService.descargarPdf(this.cursoId).subscribe({
      next: (pdf) => {
        const url = window.URL.createObjectURL(
          new Blob([pdf], { type: 'application/pdf' })
        );
        window.open(url, '_blank');
      },
      error: (err) => {
        console.error('Error al generar la evidencia CACEI', err);
      },
    });
  }

}
