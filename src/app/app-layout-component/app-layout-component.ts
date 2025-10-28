import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout-component',
  imports: [Header, RouterOutlet],
  templateUrl: './app-layout-component.html',
  styleUrl: './app-layout-component.scss',
})
export class AppLayoutComponent {}
