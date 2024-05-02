import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogDataModel } from '../add-model/add-model.component';
import { ModelService } from '../../../../services/model.service';
@Component({
  selector: 'delete-model',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataModel,
    private modelService: ModelService
  ) {}
  deleteModel() {
    this.modelService.deleteModel(this.data._id).subscribe(
      (res) => {
        this.modelService.socket$.next(res);
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
