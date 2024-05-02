import { Component, Inject, model, OnInit } from '@angular/core';
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
import { ModelService } from '../../../../services/model.service';
import { BrandService } from '../../../../services/brand.service';

export interface DialogDataModel {
  _id: string;
  brand: string;
  model: string;
}

@Component({
  selector: 'app-add-model',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-model.component.html',
  styleUrl: './add-model.component.css',
})
export class AddModelComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataModel,
    public dialog: MatDialog,
    private modelService: ModelService,
    private brandService: BrandService
  ) {}
  brands!: any[];
  ngOnInit(): void {
    this.brandService.watch().subscribe(
      (res) => {
        this.brands = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  error = false;
  showError = false;
  errorMsg = '';
  modelForm = new FormGroup({
    brand: new FormControl(this.data ? this.data.brand : '', [
      Validators.required,
    ]),
    model: new FormControl(this.data ? this.data.model : '', [
      Validators.required,
    ]),
  });
  createModel() {
    if (this.modelForm.valid && this.modelForm.value.brand!=="Brand") {
      this.error = false;
      const payload: any = {
        brand: this.modelForm.value.brand,
        model: this.modelForm.value.model,
      };

      this.modelService.addModel(payload).subscribe(
        (res: any) => {
          this.modelService.socket$.next(res);
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
  updateModel() {
    if (this.modelForm.valid) {
      this.error = false;
      let payload: any = {
        brand: this.modelForm.value.brand,
        model: this.modelForm.value.model,
      };
      this.modelService.updateModel(this.data._id, payload).subscribe(
        (res: any) => {
          this.modelService.socket$.next(res);
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
  handleModel() {
    if (this.data) {
      this.updateModel();
    } else {
      this.createModel();
    }
  }
}
