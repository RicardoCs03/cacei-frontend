import { forkJoin, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcesoAcreditacionRequest, ProcesoAcreditacionResponse, ProcesoEstado } from '../../../../core/models/procesoAcreditacion.model';
import { ProcesoAcreditacionService } from '../../../../core/services/proceso-acreditacion.service';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { CoordinadorCaceiResponse } from '../../../../core/models/coordinadorCacei.model';
import { CoordinadorCaceiService } from '../../../../core/services/coordinador-cacei.service';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';

@Component({
  selector: 'app-acreditaciones-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './acreditaciones-form.html',
  styleUrl: './acreditaciones-form.css',
})
export class AcreditacionesForm implements OnInit {

  proceso: ProcesoAcreditacionResponse | null = null;
  isEdit = false;

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly guardando = signal(false);

  data: ProcesoAcreditacionRequest = {
    cicloEvaluacion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'INICIADO',
  };

  estados: ProcesoEstado[] = ['INICIADO', 'EN_PROGRESO', 'COMPLETADO', 'EN_REVISION', 'CERRADO'];

  programas: ProgramaEducativo[] = [];
  coordinadores: CoordinadorCaceiResponse[] = [];

  private id!: number;

  constructor(
    private service: ProcesoAcreditacionService,
    private programaService: ProgramaEducativoService,
    private coordinadorService: CoordinadorCaceiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    this.id = idParam ? +idParam : 0;

    // Los catalogos y el proceso se resuelven juntos: si el proceso se asignara
    // antes, los desplegables no tendrian opciones con las que emparejar y
    // quedarian en blanco.
    forkJoin({
      programas: this.programaService.findAll(),
      coordinadores: this.coordinadorService.findAll(),
      proceso: idParam ? this.service.findById(+idParam) : of(null),
    }).subscribe({
      next: ({ programas, coordinadores, proceso }) => {
        this.programas = programas ?? [];
        this.coordinadores = coordinadores ?? [];

        if (proceso) {
          this.proceso = proceso;
          this.data = {
            // Los ids vienen del backend: son los que preseleccionan los combos.
            programaEducativofk: proceso.programaEducativofk,
            coordinadorCaceifk: proceso.coordinadorCaceifk,
            cicloEvaluacion: proceso.cicloEvaluacion,
            fechaInicio: proceso.fechaInicio,
            fechaFin: proceso.fechaFin ?? undefined,
            estado: proceso.estado,
          };
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
    // Sin este candado se puede pulsar "Guardar" dos veces y duplicar el registro.
    if (this.guardando()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const peticion = this.isEdit
      ? this.service.update(this.id, this.data)
      : this.service.create(this.data);

    peticion.subscribe({
      next: () => this.router.navigate(['/admin/acreditaciones']),
      error: (err) => {
        this.guardando.set(false);
        this.error.set(mensajeDeError(err));
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/acreditaciones']);
  }
}
