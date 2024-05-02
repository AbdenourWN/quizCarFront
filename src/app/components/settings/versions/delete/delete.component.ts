import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ModelService } from '../../../../services/model.service';
import { DialogDataVersion } from '../add-version/add-version.component';
import { VersionService } from '../../../../services/version.service';

@Component({
  selector: 'delete-version',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataVersion,
    private versionService: VersionService
  ) {}
  deleteVersion() {
    this.versionService.deleteVersion(this.data._id).subscribe(
      (res) => {
        this.versionService.socket$.next(res);
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
