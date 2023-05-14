import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoaderService {
  isLoading = new Subject<boolean>();

  constructor(
    private spinner: NgxSpinnerService
  ) {
  }

  show(name = 'spinnerPrincipal') {
    this.spinner.show(name);
    this.isLoading.next(true);
  }
  hide(name = 'spinnerPrincipal') {
    this.spinner.hide(name);
    this.isLoading.next(false);
  }
}
