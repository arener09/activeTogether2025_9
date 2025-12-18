import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '../../shared/store';
import { Backend } from '../../shared/backend';
import { RegistrationDto } from '../../shared/Interfaces/Registration';

@Component({
  selector: 'app-data',
  imports: [DatePipe],
  templateUrl: './data.html',
  styleUrl: './data.scss',
})
export class Data {
  public store = inject(Store);
  private backend = inject(Backend);

  ngOnInit() {}

  public onDeleteRegistration(registration: RegistrationDto) {
    const confirmed = confirm('Möchten Sie die Anmeldung wirklich löschen?');
    if (!confirmed) {
      return;
    }

    this.backend.deleteRegistration(registration.id);
  }
}
