import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-terms-of-service',
  imports: [Header, Footer],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.scss',
})
export class TermsOfService {
  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }
}
