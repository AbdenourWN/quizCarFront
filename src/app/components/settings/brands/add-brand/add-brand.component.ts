import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { BrandService } from '../../../../services/brand.service';

export interface DialogDataBrand {
  _id: string;
  brand: string;
}

@Component({
  selector: 'app-add-brand',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-brand.component.html',
  styleUrl: './add-brand.component.css',
})
export class AddBrandComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataBrand,
    public dialog: MatDialog,
    private brandService: BrandService
  ) {}
  ngOnInit(): void {
  }
  error = false;
  showError = false;
  errorMsg = '';
  brandForm = new FormGroup({
    brand: new FormControl(this.data ? this.data.brand : '', [
      Validators.required,
    ]),
  });
  createBrand() {
    if (this.brandForm.valid) {
      this.error = false;
      const payload: any = {
        brand: this.brandForm.value.brand,
      };

      this.brandService.addBrand(payload).subscribe(
        (res: any) => {
          this.brandService.socket$.next(res);
          this.dialog.closeAll();
        },
        (err: any) => {
          this.errorMsg = err.error.error;
          this.showError = true;
        }
      );
    } else {
      this.error = true;
    }
  }
  updateBrand() {
    if (this.brandForm.valid) {
      this.error = false;
      let payload: any = {
        brand: this.brandForm.value.brand,
      };
      this.brandService.updateBrand(this.data._id, payload).subscribe(
        (res: any) => {
          this.brandService.socket$.next(res);
          this.dialog.closeAll();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.error = true;
    }
  }
  handleBrand() {
    if (this.data) {
      this.updateBrand();
    } else {
      this.createBrand();
    }
  }
}
