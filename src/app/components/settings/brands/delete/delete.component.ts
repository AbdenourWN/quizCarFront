import { Component, Inject } from '@angular/core';
import { BrandService } from '../../../../services/brand.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { DialogDataBrand } from '../add-brand/add-brand.component';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataBrand,
    private brandService: BrandService
  ) {}
  deleteBrand() {
    this.brandService.deleteBrand(this.data._id).subscribe(
      (res) => {
        this.brandService.socket$.next(res);
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
