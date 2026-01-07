import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExperienciaEducativa } from '../../../../core/models/experienciaEducativa.model';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private service: ExperienciaEducativaService,private programaService: ProgramaEducativoService,private route: ActivatedRoute,private router: Router) {
    console.log('ExperienciasEducativasForm component initialized');
  }

  ngOnInit(): void {
    this.programaService.findAll().subscribe(data => {
      this.programas = data;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.findById(+id).subscribe(data => {
        this.experiencia = data;
      });
    }
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

