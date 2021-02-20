import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { Subject } from "rxjs";

interface Item {
  [key: string]: string;
}

@Component({
  selector: "formly-ng-select",
  template: `
    <div>
      <ng-select
        [items]="to.options"
        [formControl]="formControl"
        [bindValue]="bindValue"
        [bindLabel]="bindLabel"
        [groupBy]="'group'"
        [placeholder]="to.label"
        [multiple]="to.multiple || false"
        [loading]="itemLoading"
        [typeahead]="itemInput$"
        [trackByFn]="trackByFn"
      >
        <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
          <div class="ng-option-label">
            <span [ngOptionHighlight]="search">{{ item[bindLabel] }}</span>
          </div>
          <ng-container *ngIf="showValue">
            <small><b>ID:</b> {{ item[bindValue] }}</small>
          </ng-container>
        </ng-template>
      </ng-select>
    </div>
  `,
})
export class SelectTypeComponent extends FieldType implements OnInit {
  itemLoading: boolean = false;
  showValue: boolean = false;
  itemInput$ = new Subject<string>();
  bindValue: string;
  bindLabel: string;

  ngOnInit() {
    // On the autocomplete component these settings can be configured...
    // this.showValue = this.to.showValue || false;
    // this.bindValue = this.to.bindValue || "value";
    // this.bindLabel = this.to.bindLabel || "label";
    // here are fixed because there is no use case requiring this kind of customization
    this.showValue = false; // this is exacly the default of ng-select ...
    this.bindValue = "value"; // this is exacly the default of ng-select ...
    this.bindLabel = "label"; // this is exacly the default of ng-select ...
  }

  trackByFn(item: Item) {
    return item[this.bindValue];
  }
}
