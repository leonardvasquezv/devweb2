import { Directive, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription, fromEvent, Subject } from 'rxjs';
import { debounceTime, pluck, tap } from 'rxjs/operators';

@Directive({
  selector: '[appSearchInput]'
})
export class SearchInputDirective implements OnDestroy {

  keyupSubscription: Subscription;

  @Output() onSearch: EventEmitter<string> = new EventEmitter();
  @Output() seconds: number = 1000;

  constructor(el: ElementRef) {
    this.keyupSubscription = fromEvent( el.nativeElement , 'keyup')
      .pipe( 
        pluck('target', 'value'),
        debounceTime(this.seconds)
      )
      .subscribe( (data: string) => this.onSearch.emit(data) );
  }
    
  ngOnDestroy() {
    this.keyupSubscription.unsubscribe();
  }
  
}
