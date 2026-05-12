import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [FormsModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

    stars = [1, 2, 3, 4, 5];
  rating = 0;
  hoverRating = 0;
  feedback = '';
  submitted = false;
  submitting = false;

  currentYear = new Date().getFullYear();

  setHover(star: number) {
    this.hoverRating = star;
  }

  clearHover() {
    this.hoverRating = 0;
  }

  setRating(star: number) {
    this.rating = star;
    this.submitted = false; // reset feedback state when user changes rating
  }

  submitFeedback() {
    if (!this.rating && !this.feedback.trim()) {
      return;
    }

    this.submitting = true;

    // For now just log — later hook this to an API / email / Firestore etc.
    console.log('Feedback submitted:', {
      rating: this.rating,
      feedback: this.feedback.trim(),
    });

    this.submitting = false;
    this.submitted = true;
    this.feedback = '';

    // Optional: clear "Thanks" after a bit
    setTimeout(() => {
      this.submitted = false;
    }, 2500);
  }

}
