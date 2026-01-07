import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { ExperienciaEducativa } from '../../../../core/models/experienciaEducativa.model';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { AtributoEgreso } from '../../../../core/models/atributoEgreso.model';
import { AtributoEgresoService } from '../../../../core/services/atributo-egreso-service';

@Component({
  selector: 'app-atributos-egreso-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atributos-egreso-check.html',
  styleUrl: './atributos-egreso-check.css',
})
export class AtributosEgresoCheck implements OnInit {

  experiencia: ExperienciaEducativa = {
    id: 0,
    nombre: '',
    horasCienciasBasicas: 0,
    horasCienciasIngenieria: 0,
    horasDisenoIngenieria: 0,
    horasCSociales: 0,
    horasCEconomicas: 0,
    horasOtros: 0,
    creditos: 0,
    programaEducativo: '',
    areaExperienciaEducativa: '',
    objetivoGeneral: '',
    isActive: true,
    nrc: '',
    preRequisitosExperiencias: [],
    atributosEgresoExperiencias: [],
  };

  // 🔥 atributoId -> grado (I | M | A)
  atributosSeleccionados: Record<number, 'I' | 'M' | 'A'> = {};

  atributoEgreso: AtributoEgreso[] = [];

  constructor(
    private route: ActivatedRoute,
    private experienciaService: ExperienciaEducativaService,
    private atributoEgresoService: AtributoEgresoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.experienciaService.findById(id).pipe(
      switchMap(data => {
        this.experiencia = data;
        this.experiencia.id = id;

        // Cargar atributos del programa (usa string del DTO)
        return this.atributoEgresoService.findByPlanEstudio(
          this.experiencia.programaEducativo
        );
      })
    ).subscribe(attrData => {
      this.atributoEgreso = attrData;

      // Precargar los atributos ya asociados a la experiencia
      this.atributosSeleccionados = {};
      this.experiencia.atributosEgresoExperiencias.forEach(id => {
        this.atributosSeleccionados[id] = 'I'; // valor por defecto
      });
    });
  }

  // -------------------------
  // Helpers de UI
  // -------------------------
  isAtributoSeleccionado(id: number): boolean {
    return id in this.atributosSeleccionados;
  }

  onToggleAtributo(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.atributosSeleccionados[id] = 'I';
    } else {
      delete this.atributosSeleccionados[id];
    }
  }

  onGradoChange(id: number, grado: 'I' | 'M' | 'A'): void {
    if (id in this.atributosSeleccionados) {
      this.atributosSeleccionados[id] = grado;
    }
  }

  // -------------------------
  // Guardado
  // -------------------------
  guardarAtributos(): void {
    if (!this.experiencia.id) {
      console.error('Experiencia educativa sin ID');
      return;
    }

    const payload = {
      experienciaEducativaId: this.experiencia.id,
      atributosEgresoExperienciaDTOList: Object.entries(this.atributosSeleccionados).map(
        ([atributoEgresoId, grado]) => ({
          atributoEgresoId: Number(atributoEgresoId),
          gradoAportacion: grado
        })
      )
    };

    console.log('Payload enviado:', payload);

    this.experienciaService.actualizarAtributosEgreso(payload)
      .subscribe(() => {
        console.log('Atributos de egreso guardados correctamente');
      });
  }
}
