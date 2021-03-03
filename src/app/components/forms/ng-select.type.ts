import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { Observable, of } from "rxjs";
import { tap } from 'rxjs/operators';
import { ApiService } from "@rapydo/services/api";

@Component({
  selector: 'formly-ng-select',
  template:`
    <div>
      <ng-select
        [items]="items$ | async"
        [placeholder]="to.label"
        [bindValue]="to.bindValue || 'value'"
        [formControl]="formControl"
        [multiple]="to.multiple || false"
        [loading]="loading"
        (search)="onSearch($event)"
      >
      </ng-select>
    </div>
  `
})
export class NgSelectFormlyComponent extends FieldType implements OnInit {

  loading: boolean = false;
  items$: Observable<any[]>;
  private endpoint: string;

   constructor(private api: ApiService){
     super();
   }

   onSearch($event) {
     this.items$ = of([]);
     const term = $event.term;
     if (!term || 0 === term.length) return;
     this.loading = true;
     this.items$ = this.api.get<any[]>(`${this.endpoint}/${term}`)
      .pipe(tap(() => this.loading = false));
   }

   ngOnInit() {
     this.endpoint = this.to['endpoint'];
   }
}