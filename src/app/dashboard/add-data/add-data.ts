/**
 * @author Alexander R. Brenner - BSWE3B, Hochschule Burgenland
 * 
 * Registration form component for course sign-ups
 * Uses Angular Material components with form validation (required, min, max)
 */
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '../../shared/store';
import { Backend } from '../../shared/backend';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-data',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './add-data.html',
  styleUrl: './add-data.scss',
})
export class AddData {
  public store = inject(Store);
  public backend = inject(Backend);
  private fb = inject(FormBuilder);
  public signupForm: any;
  public isSubmitting = false;
  public submitSucceeded = false;

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      newsletter: [false],
      courseId: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isSubmitting = true;
      this.submitSucceeded = false;
      const formValue = { ...this.signupForm.value };
      // Convert Date object to local ISO-like string (yyyy-MM-dd) in de-AT Locale, ohne Zeitzonen-Verschiebung
      if (formValue.birthdate instanceof Date) {
        formValue.birthdate = formatDate(formValue.birthdate, 'yyyy-MM-dd', 'de-AT');
      }
      this.backend.addRegistration(formValue);
      this.signupForm.reset();
      this.signupForm.patchValue({ newsletter: false });
      this.isSubmitting = false;
      this.submitSucceeded = true;
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach((key) => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Dieses Feld ist erforderlich';
    }
    if (control?.hasError('email')) {
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    if (control?.hasError('minlength')) {
      return `Mindestens ${control.errors?.['minlength'].requiredLength} Zeichen erforderlich`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximal ${control.errors?.['maxlength'].requiredLength} Zeichen erlaubt`;
    }
    return '';
  }
}
