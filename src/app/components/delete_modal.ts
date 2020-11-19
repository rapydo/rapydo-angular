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
    <div class="modal-header modal-warning bg-light">
      <h5 class="modal-title" id="modal-title">
        <i class="fas fa-exclamation-circle"></i> {{ title }}
      </h5>
      <button
        type="button"
        class="close"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body text-center">
      <p class="text-danger">
        <strong>{{ text }}</strong>
      </p>

      <p *ngIf="!disableSubText">
        All information associated to this element will be permanently deleted.
        <strong>This operation cannot be undone</strong>.
      </p>

      <p *ngIf="subText">{{ subText }}</p>
    </div>
    <div class="modal-footer bg-light">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        {{ cancelButton }}
      </button>
      <button
        type="button"
        ngbAutofocus
        class="btn btn-sm btn-danger"
        (click)="modal.close('Ok click')"
      >
        {{ confirmButton }}
      </button>
    </div>
  `,
})
export class DeleteModal implements OnInit {
  @Input() public title: string = "Confirmation required";
  @Input() public text: string;
  @Input() public disableSubText: boolean = false;
  @Input() public subText: string;
  @Input() public cancelButton: string = "No, cancel";
  @Input() public confirmButton: string = "Yes, delete";

  constructor(public modal: NgbActiveModal) {}

  public ngOnInit(): void {}
}
