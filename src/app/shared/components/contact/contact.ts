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
  hideH5Name = false;
  hideH5Email = false;
  hideH5Message = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      privacy: [false, Validators.requiredTrue]
    });
  }

  onOutsideClick() {
    if (!this.contactForm.get('name')?.value) {
      this.hideH5Name = false;
    }
    if (!this.contactForm.get('email')?.value) {
      this.hideH5Email = false;
    }
    if (!this.contactForm.get('message')?.value) {
      this.hideH5Message = false;
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;

      this.http.post('https://formspree.io/f/xkoavznz', formData)
        .subscribe({
          next: (response) => {
            alert('Vielen Dank! Deine Nachricht wurde gesendet.');
            this.contactForm.reset();
            this.hideH5Name = false;
            this.hideH5Email = false;
            this.hideH5Message = false;
          },
          error: (error) => {
            alert('Fehler beim Senden. Bitte versuche es noch einmal.');
            console.error('Formspree Error:', error);
          }
        });
    }
  }
}
