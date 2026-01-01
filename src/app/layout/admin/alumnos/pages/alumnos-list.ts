import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Alumno } from '../../../../core/models/alumno.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alumnos-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './alumnos-list.html',
  styleUrl: './alumnos-list.css',
})
export class AlumnosList {

 alumnos: Alumno[] = [];

  constructor(
    private service: AlumnoService,
    private router: Router
  ) {}  
  ngOnInit(): void {
    this.load();
  } 
  load(): void {
    this.service.findAll().subscribe(data => this.alumnos = data);
  } 
  create(): void {
    this.router.navigate(['/admin/alumnos/crear']);
  } 
  edit(id: number): void {
    this.router.navigate([`/admin/alumnos/editar/${id}`]);
  } 
  remove(id: number): void {
    this.service.delete(id).subscribe(() => this.load());
  }

}
