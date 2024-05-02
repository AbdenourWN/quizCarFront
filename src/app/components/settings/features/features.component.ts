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
import { FormsModule } from '@angular/forms';
import { FeatureService } from '../../../services/feature.service';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule,FormsModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent implements OnInit, AfterViewInit {
  constructor(
    private featureService: FeatureService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
  ) {}
  features!: any[];
  featureFilter!: any[];
  featureSearch!: any[];
  displayedColumns: string[] = ['_id', 'feature'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  permissions: any;
  ngOnInit(): void {
    this.featureService.getFeatures().subscribe((res: any) => {
      this.searchBar = '';
      this.features = res;
      this.length = this.features.length;
      this.featureFilter = this.features.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.featureFilter;
      // Additional logic to update the UI based on the new model data
    });
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
  filterFeatures(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.featureFilter = this.features.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.featureFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the models based on the name containing the input value
    this.featureSearch = this.features.filter((question) =>
      question.question.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.featureSearch.length;
    // Update the data source with the filtered data
    this.featureFilter = this.featureSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.featureFilter;
    // Reset the paginator to the first page
  }
}
