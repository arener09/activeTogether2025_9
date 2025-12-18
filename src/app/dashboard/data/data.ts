import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '../../shared/store';
import { Backend } from '../../shared/backend';
import { RegistrationDto } from '../../shared/Interfaces/Registration';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-data',
  imports: [DatePipe],
  templateUrl: './data.html',
  styleUrl: './data.scss',
})
export class Data {
  public store = inject(Store);
  private backend = inject(Backend);

  // Pagination state for registrations
  public registrationsPerPage = 5;
  public currentPage = 1;

  // Row-level loading state for delete actions
  private deletingRegistrationIds = new Set<string>();

  public get totalRegistrations(): number {
    return this.store.registrations.length;
  }

  public get totalPages(): number {
    if (this.totalRegistrations === 0) {
      return 1;
    }
    return Math.ceil(this.totalRegistrations / this.registrationsPerPage);
  }

  public get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  public get paginatedRegistrations(): RegistrationDto[] {
    if (this.totalRegistrations === 0) {
      this.currentPage = 1;
      return [];
    }

    // Ensure current page is always within valid bounds
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.registrationsPerPage;
    const endIndex = startIndex + this.registrationsPerPage;
    return this.store.registrations.slice(startIndex, endIndex);
  }

  ngOnInit() {}

  public isDeleting(registration: RegistrationDto): boolean {
    return this.deletingRegistrationIds.has(registration.id);
  }

  public goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  public goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  public goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  public onDeleteRegistration(registration: RegistrationDto) {
    const confirmed = confirm('Möchten Sie die Anmeldung wirklich löschen?');
    if (!confirmed) {
      return;
    }

    this.deletingRegistrationIds.add(registration.id);

    this.backend
      .deleteRegistration(registration.id)
      .pipe(
        finalize(() => {
          this.deletingRegistrationIds.delete(registration.id);
        })
      )
      .subscribe();
  }
}
