import { Component, OnInit } from '@angular/core';
import { Curso } from '../../../../core/models/cursos.model';
import { CursoService } from '../../../../core/services/curso.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursos-profesor',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './cursos-profesor.html',
  styleUrl: './cursos-profesor.css',
})
export class CursosProfesor implements OnInit {

  cursos: Curso[] = [];

  constructor(private cursoService: CursoService) {
    console.log('CursosProfesor component loaded');
  }

  ngOnInit(): void {
    this.cursoService.findByProfesor().subscribe(data => {
      this.cursos = data;
    });
  }

}
