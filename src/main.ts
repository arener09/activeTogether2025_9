import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import localeDeAt from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDeAt);

// Custom DateAdapter to ensure dd.MM.yyyy parsing for typed input (also supports separators . / -)
class DeAtDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.trim().length) {
      const cleaned = value.trim();
      const parts = cleaned.split(/[.\-\/]/); // erlaubte Separatoren: ., -, /
      if (parts.length === 3) {
        const [dayStr, monthStr, yearStr] = parts;
        const day = Number(dayStr);
        const month = Number(monthStr) - 1; // JS-Monate: 0-11
        const year = Number(yearStr);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month, day);
          // Validierung: JS-Date-Overflow vermeiden (z.B. 32.13.2020)
          if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            return date;
          }
        }
      }
    }
    return super.parse(value);
  }
}

const AT_DATE_FORMATS = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd.MM.yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    { provide: MAT_DATE_LOCALE, useValue: 'de-AT' },
    { provide: DateAdapter, useClass: DeAtDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AT_DATE_FORMATS },
  ],
});
