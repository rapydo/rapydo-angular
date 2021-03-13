import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-header bg-default">
      <h4 class="modal-title">{{ modalTitle }}</h4>

      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <form [formGroup]="form" (ngSubmit)="backRef.submit()">
      <div class="modal-body">
        <formly-form [form]="form" [fields]="fields" [model]="model">
        </formly-form>
      </div>

      <div class="modal-footer d-flex">
        <div class="mr-auto p-2">
          <button
            type="button"
            class="btn btn-outline-secondary"
            (click)="modal.close('Close click')"
          >
            Close
          </button>
        </div>

        <div class="p-2">
          <button type="submit" class="btn btn-success" [disabled]="updating">
            Submit
          </button>
        </div>
      </div>
    </form>
  `,
})
export class FormModal implements OnInit {
  @Input() public backRef;
  @Input() public modalTitle;
  @Input() public updating;
  @Input() public form;
  @Input() public fields;
  @Input() public model;

  constructor(public modal: NgbActiveModal) {}
  public ngOnInit(): void {
    if (this.fields.length > 0) {
      this.fields[0].focus = true;
    }
  }
}
