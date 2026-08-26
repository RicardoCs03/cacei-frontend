import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmacionDialogoComponent } from './shared/confirmacion/confirmacion-dialogo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmacionDialogoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
