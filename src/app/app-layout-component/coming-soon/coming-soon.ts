import { Component } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  imports: [],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
  // Target Launch Date (e.g., 14 days from now)
  targetDate = new Date().getTime() + 14 * 24 * 60 * 60 * 1000;

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  private timerInterval: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate - now;

      if (distance < 0) {
        clearInterval(this.timerInterval);
        return;
      }

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }

  subscribe(event: Event) {
    event.preventDefault();
    // Add logic to call backend API later
    alert("Thanks for subscribing! We'll notify you.");
    const form = event.target as HTMLFormElement;
    form.reset();
  }
}
