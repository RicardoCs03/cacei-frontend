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
    this.programaService.findAll().subscribe(d => this.programas = d);
    this.coordinadorService.findAll().subscribe(d => this.coordinadores = d);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.service.findAll().subscribe(data => {
        const proceso = data.find(p => p.id === this.id);
        if (proceso) {
          this.proceso = proceso;
          this.data = {
            cicloEvaluacion: proceso.cicloEvaluacion,
            fechaInicio: proceso.fechaInicio,
            fechaFin: proceso.fechaFin ?? undefined,
            estado: proceso.estado,
          };
        }
      });
    }
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
