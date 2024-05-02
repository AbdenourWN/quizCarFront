import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DeleteComponent } from './delete/delete.component';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../../services/brand.service';
import { AddBrandComponent } from './add-brand/add-brand.component';

export interface brand {
  _id: string;
  brand: string;
}

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit, AfterViewInit {
  constructor(
    private brandService: BrandService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialogBrand: MatDialog,
  ) {}

  brands!: any[];
  brandFilter!: any[];
  brandSearch!: any[];
  displayedColumns: string[] = ['_id', 'brand', 'actions'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  permissions: any;
  ngOnInit(): void {
    this.brandService.getItsPermission().subscribe(
      (res) => {
        this.permissions = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.brandService.watch().subscribe((res: any) => {
      this.searchBar = '';
      this.brands = res;
      this.length = this.brands.length;
      this.brandFilter = this.brands.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.brandFilter;
      // Additional logic to update the UI based on the new brand data
    });
    this.brandService.getBrands();
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
  openCreateBrand() {
    this.dialogBrand.open(AddBrandComponent, {
      data: null,
    });
  }
  openUpdateBrand(element: brand) {
    this.dialogBrand.open(AddBrandComponent, {
      data: {
        _id: element._id,
        brand: element.brand,
      },
    });
  }
  openDeleteBrand(element: brand) {
    this.dialogBrand.open(DeleteComponent, {
      data: {
        _id: element._id,
        brand: element.brand,
      },
    });
  }
  filterBrands(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.brandFilter = this.brands.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.brandFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the brands based on the name containing the input value
    this.brandSearch = this.brands.filter((brand) =>
      brand.brand.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.brandSearch.length;
    // Update the data source with the filtered data
    this.brandFilter = this.brandSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.brandFilter;
    // Reset the paginator to the first page
  }
}
