import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputDirective } from './search-input.directive';



@NgModule({
  declarations: [
    SearchInputDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SearchInputDirective
  ]
})
export class DirectivesModule { }
