import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  model,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DeleteComponent } from './delete/delete.component';
import { FormsModule } from '@angular/forms';
import { AddModelComponent } from './add-model/add-model.component';
import { ModelService } from '../../../services/model.service';
import { BrandService } from '../../../services/brand.service';

export interface model {
  _id: string;
  brand: string;
  brandId: string;
  model: string;
}

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './models.component.html',
  styleUrl: './models.component.css',
})
export class ModelsComponent implements OnInit, AfterViewInit {
  constructor(
    private modelService: ModelService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialogBrand: MatDialog,
    private brandService: BrandService
  ) {}

  models!: any[];
  modelFilter!: any[];
  modelSearch!: any[];
  displayedColumns: string[] = ['_id', 'brand', 'model', 'actions'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  brands!: any[];
  permissions: any;
  ngOnInit(): void {
    this.brandService.getBrands();
    this.modelService.getItsPermission().subscribe(
      (res) => {
        this.permissions = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.modelService.watch().subscribe((res: any) => {
      this.searchBar = '';
      this.models = res;
      this.length = this.models.length;
      if (!this.brands) {
        this.brandService.watch().subscribe(
          (res) => {
            this.brands = res;
            this.models.forEach((model) => {
              for (let i = 0; i < this.brands.length; i++) {
                const element = this.brands[i];
                if (model.brand === element._id) {
                  model.brand = element.brand;
                  model.brandId = element._id;
                }
              }
            });
          },
          (err) => console.log(err)
        );
      } else {
        this.models.forEach((model) => {
          for (let i = 0; i < this.brands.length; i++) {
            const element = this.brands[i];
            if (model.brand === element._id) {
              model.brand = element.brand;
              model.brandId = element._id;
            }
          }
        });
      }
      this.modelFilter = this.models.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.modelFilter;
      // Additional logic to update the UI based on the new brand data
    });
    this.modelService.getModels();
  }
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  openCreateModel() {
    this.dialogBrand.open(AddModelComponent, {
      data: null,
    });
  }
  openUpdateModel(element: model) {
    this.dialogBrand.open(AddModelComponent, {
      data: {
        _id: element._id,
        brand: element.brandId,
        model: element.model,
      },
    });
  }
  openDeleteModel(element: model) {
    this.dialogBrand.open(DeleteComponent, {
      data: {
        _id: element._id,
        brand: element.brandId,
        model: element.model,
      },
    });
  }
  filterModels(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.modelFilter = this.models.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.modelFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the models based on the name containing the input value
    this.modelSearch = this.models.filter((model) =>
      model.model.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.modelSearch.length;
    // Update the data source with the filtered data
    this.modelFilter = this.modelSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.modelFilter;
    // Reset the paginator to the first page
  }
}
