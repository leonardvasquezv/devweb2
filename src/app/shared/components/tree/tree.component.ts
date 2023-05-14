import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as types from 'gijgo';

declare var jQuery: any;

@Component({
  selector: 'gijgo-tree',
  templateUrl: './tree.component.html'
})
export class TreeComponent implements AfterViewInit, OnDestroy, OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    const config = changes.configuration.currentValue;
    if (this.div !== undefined) {
      if (config.dataSource.length > 0) {
        if (this.instance !== undefined) {
          this.instance.destroy();
        }
        this.instance = jQuery(this.div.nativeElement).tree(config);
      }
    }
  }

  @ViewChild('div') div: ElementRef;

  @Input() instance: types.Tree;

  @Input() configuration: types.TreeSettings;

  ngAfterViewInit() {
    this.instance = jQuery(this.div.nativeElement).tree(this.configuration);
  }

  ngOnDestroy() {
    this.instance.destroy();
  }


}