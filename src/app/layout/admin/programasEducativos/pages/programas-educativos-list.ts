import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';

@Component({
  selector: 'app-programas-educativos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './programas-educativos-list.html',
  styleUrl: './programas-educativos-list.css',
})
export class ProgramaEducativoListComponent implements OnInit {

  programasEducativos: ProgramaEducativo[] = [];

  constructor(private programaEducativoService: ProgramaEducativoService,private router: Router) {
    console.log('ProgramaEducativoListComponent initialized');
  }

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programaEducativoService.findAll().subscribe(programaEducativo => {
      this.programasEducativos = programaEducativo;
    });
  }

  create(): void {
    this.router.navigate(['/admin/programas-educativos/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/programas-educativos/editar/${id}`]);
  }

  remove(id: number): void {
    this.programaEducativoService.delete(id).subscribe(() => {
      this.loadPrograms();
    });
  }
}
