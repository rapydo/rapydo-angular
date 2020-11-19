import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DeleteModal } from "@rapydo/components/delete_modal";
import { ConfirmationModalOptions } from "@rapydo/types";

@Injectable()
export class ConfirmationModals {
  constructor(protected modalService: NgbModal) {}

  public open(options: ConfirmationModalOptions): Promise<any> {
    const deleteModalRef: NgbModalRef = this.modalService.open(DeleteModal, {
      backdrop: "static",
    });

    deleteModalRef.componentInstance.text = options.text;

    if (options.title) {
      deleteModalRef.componentInstance.title = options.title;
    }

    if (options.disableSubText) {
      deleteModalRef.componentInstance.disableSubText = options.disableSubText;
    }

    if (options.subText) {
      deleteModalRef.componentInstance.disableSubText = true;
      deleteModalRef.componentInstance.subText = options.subText;
    }

    if (options.confirmButton) {
      deleteModalRef.componentInstance.confirmButton = options.confirmButton;
    }

    if (options.cancelButton) {
      deleteModalRef.componentInstance.cancelButton = options.cancelButton;
    }

    return deleteModalRef.result;
  }
}
