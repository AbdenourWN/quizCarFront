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
import { VersionService } from '../../../../services/version.service';


export interface DialogDataVersion {
  _id: string;
  version: string;
  model: string;
}
@Component({
  selector: 'app-add-version',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-version.component.html',
  styleUrl: './add-version.component.css'
})

export class AddVersionComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataVersion,
    public dialog: MatDialog,
    private modelService: ModelService,
    private versionService: VersionService
  ) {}
  models!: any[];
  ngOnInit(): void {
    this.modelService.watch().subscribe(
      (res) => {
        this.models = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  error = false;
  showError = false;
  errorMsg = '';
  versionForm = new FormGroup({
    version: new FormControl(this.data ? this.data.version : '', [
      Validators.required,
    ]),
    model: new FormControl(this.data ? this.data.model : '', [
      Validators.required,
    ]),
  });
  createVersion() {
    if (this.versionForm.valid && this.versionForm.value.model!=="Model") {
      this.error = false;
      const payload: any = {
        model: this.versionForm.value.model,
        version: this.versionForm.value.version,
      };

      this.versionService.addVersion(payload).subscribe(
        (res: any) => {
          this.versionService.socket$.next(res);
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
  updateVersion() {
    if (this.versionForm.valid) {
      this.error = false;
      let payload: any = {
        version: this.versionForm.value.version,
        model: this.versionForm.value.model,
      };
      this.versionService.updateVersion(this.data._id, payload).subscribe(
        (res: any) => {
          this.versionService.socket$.next(res);
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
  handleVersion() {
    if (this.data) {
      this.updateVersion();
    } else {
      this.createVersion();
    }
  }
}
