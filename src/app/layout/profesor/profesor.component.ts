import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-profesor.component',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './profesor.component.html',
  styleUrl: './profesor.component.css',
})
export class ProfesorComponent {

}
