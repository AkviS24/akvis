import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;

      this.http.post('https://formspree.io/f/xkoavznz', formData)
        .subscribe({
          next: (response) => {
            alert('Vielen Dank! Deine Nachricht wurde gesendet.');
            this.contactForm.reset();
          },
          error: (error) => {
            alert('Fehler beim Senden. Bitte versuche es noch einmal.');
            console.error('Formspree Error:', error);
          }
        });
    }
  }
}
