import { forkJoin, of } from 'rxjs';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExperienciaEducativa } from '../../../../core/models/experienciaEducativa.model';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';

@Component({
  selector: 'app-experiencias-educativas-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './experiencias-educativas-form.html',
  styleUrl: './experiencias-educativas-form.css',
})
export class ExperienciasEducativasForm {

  experiencia: ExperienciaEducativa = {
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

  programas: ProgramaEducativo[] = [];
  isEdit = false;

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private service: ExperienciaEducativaService,private programaService: ProgramaEducativoService,private route: ActivatedRoute,private router: Router) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    // El catalogo y el registro se resuelven juntos, para que los desplegables
    // ya tengan opciones cuando se asigna la experiencia educativa.
    forkJoin({
      programas: this.programaService.findAll(),
      experiencia: id ? this.service.findById(+id) : of(null),
    }).subscribe({
      next: ({ programas, experiencia }) => {
        this.programas = programas ?? [];
        if (experiencia) {
          this.experiencia = { ...this.experiencia, ...experiencia };
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
    if (this.isEdit && this.experiencia.id) {
      this.service.update(this.experiencia.id, this.experiencia)
        .subscribe(() => this.router.navigate(['/admin/experiencias-educativas']));
    } else {
      this.service.create(this.experiencia)
        .subscribe(() => this.router.navigate(['/admin/experiencias-educativas']));
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/experiencias-educativas']);
  }
}

