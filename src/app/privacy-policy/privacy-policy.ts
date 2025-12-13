import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-privacy-policy',
  imports: [Header, Footer],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }
}
