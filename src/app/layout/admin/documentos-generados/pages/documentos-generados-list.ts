import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocumentoGeneradoResponse } from '../../../../core/models/documentoGenerado.model';
import { DocumentoGeneradoService } from '../../../../core/services/documento-generado.service';
import { EvidenciaCatedraService } from '../../../../core/services/evidencia-catedra.service';

@Component({
  selector: 'app-documentos-generados-list',
  imports: [CommonModule],
  templateUrl: './documentos-generados-list.html',
  styleUrl: './documentos-generados-list.css',
})
export class DocumentosGeneradosList implements OnInit {
  documentos: DocumentoGeneradoResponse[] = [];

  constructor(
    private service: DocumentoGeneradoService,
    private evidenciaCatedraService: EvidenciaCatedraService
  ) {}

  ngOnInit(): void {
    this.service.findAll().subscribe(data => this.documentos = data);
  }

  verDocumento(cursoId: number): void {
    this.evidenciaCatedraService.descargarPdf(cursoId).subscribe({
      next: (pdf) => {
        const url = window.URL.createObjectURL(
          new Blob([pdf], { type: 'application/pdf' })
        );
        window.open(url, '_blank');
      },
      error: (err) => {
        console.error('Error al obtener el documento', err);
      },
    });
  }
}
