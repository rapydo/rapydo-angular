import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  tap,
  filter,
  delay,
  debounceTime,
} from "rxjs/operators";
import { ApiService } from "@rapydo/services/api";

interface Item {
  [key: string]: string;
}

@Component({
  selector: "formly-ng-select-autocomplete",
  template: `
    <div>
      <ng-select
        [items]="items$ | async"
        [formControl]="formControl"
        [bindValue]="bindValue"
        [bindLabel]="bindLabel"
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
export class AutocompleTypeComponent extends FieldType implements OnInit {
  itemLoading: boolean = false;
  showValue: boolean = false;
  items$: Observable<Item[]>;
  private endpoint: string;
  itemInput$ = new Subject<string>();
  bindValue: string;
  bindLabel: string;

  constructor(private api: ApiService) {
    super();
  }

  ngOnInit() {
    this.endpoint = this.to["endpoint"];
    this.showValue = this.to.showValue || false;
    this.bindValue = this.to.bindValue || "value";
    this.bindLabel = this.to.bindLabel || "label";

    this.loadItems();
  }

  trackByFn(item: Item) {
    return item[this.bindValue];
  }

  private loadItems() {
    this.items$ = concat(
      of(this.to["selectedItems"]), // default items
      of([]).pipe(delay(500)), // clean-up options
      this.itemInput$.pipe(
        debounceTime(300),
        filter((v) => v !== null && v !== ""),
        distinctUntilChanged(),
        tap(() => (this.itemLoading = true)),
        switchMap((term) =>
          this.api.get<Item[]>(`${this.endpoint}/${term}`).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.itemLoading = false))
          )
        )
      )
    );
  }
}
