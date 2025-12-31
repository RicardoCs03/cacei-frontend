import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';

@Component({
  selector: 'app-programas-educativos-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './programas-educativos-form.html',
  styleUrl: './programas-educativos-form.css',
})
export class ProgramaEducativoFormComponent implements OnInit {

  programaEducativo: ProgramaEducativo = {
    nombre: '',
    totalCreditos: 0,
    tPermanenciaMin: 0,
    tPermanenciaMax: 0,
    fechaCreacion: Date.now().toString(),
    contraccion: '',
    modalidad: '',
    nivelEstudio: '',
    isActive: true
  };

  isEdit = false;

  constructor(
    private programaEducativoService: ProgramaEducativoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.programaEducativoService.findById(+id).subscribe(programaEducativo => {
        this.programaEducativo = programaEducativo;
        console.log(this.programaEducativo);
      });
    }
  }

  save(): void {
    if (this.isEdit && this.programaEducativo.id) {
      this.programaEducativoService.update(this.programaEducativo.id, this.programaEducativo)
        .subscribe(() => this.router.navigate(['/admin/programas-educativos']));
    } else {
      this.programaEducativoService.create(this.programaEducativo)
        .subscribe(() => this.router.navigate(['/admin/programas-educativos']));
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/programas-educativos']);
  }
}
