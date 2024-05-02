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
import { UserService } from '../../../services/user.service';
import { ModelService } from '../../../services/model.service';
import { VersionService } from '../../../services/version.service';
import { AddVersionComponent } from './add-version/add-version.component';

export interface version {
  _id: string;
  model: string;
  version: string;
  modelId: string;
}

@Component({
  selector: 'app-versions',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './versions.component.html',
  styleUrl: './versions.component.css',
})
export class VersionsComponent implements OnInit, AfterViewInit {
  constructor(
    private modelService: ModelService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private userService: UserService,
    private versionService: VersionService
  ) {}

  versions!: any[];
  versionFilter!: any[];
  versionSearch!: any[];
  displayedColumns: string[] = ['_id', 'model', 'version', 'actions'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  models!: any[];
  permissions: any;
  ngOnInit(): void {
    this.modelService.getModels();
    this.versionService.getItsPermission().subscribe(
      (res) => {
        this.permissions = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.versionService.watch().subscribe((res: any) => {
      this.searchBar = '';
      this.versions = res;
      this.length = this.versions.length;
      if (!this.models) {
        this.modelService.watch().subscribe(
          (res) => {
            this.models = res;
            this.versions.forEach((version) => {
              for (let i = 0; i < this.models.length; i++) {
                const element = this.models[i];
                if (version.model === element._id) {
                  version.model = element.model;
                  version.modelId = element._id;
                }
              }
            });
          },
          (err) => console.log(err)
        );
      } else {
        this.versions.forEach((version) => {
          for (let i = 0; i < this.models.length; i++) {
            const element = this.models[i];
            if (version.model === element._id) {
              version.model = element.model;
              version.modelId = element._id;
            }
          }
        });
      }
      this.versionFilter = this.versions.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.versionFilter;
      // Additional logic to update the UI based on the new model data
    });
    this.versionService.getVersions();
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
  openCreateVersion() {
    this.dialog.open(AddVersionComponent, {
      data: null,
    });
  }
  openUpdateVersion(element: version) {
    this.dialog.open(AddVersionComponent, {
      data: {
        _id: element._id,
        model: element.modelId,
        version: element.version,
      },
    });
  }
  openDeleteVersion(element: version) {
    this.dialog.open(DeleteComponent, {
      data: {
        _id: element._id,
        model: element.modelId,
        version: element.version,
      },
    });
  }
  filterVersions(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.versionFilter = this.versions.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.versionFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the models based on the name containing the input value
    this.versionSearch = this.versions.filter((version) =>
      version.version.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.versionSearch.length;
    // Update the data source with the filtered data
    this.versionFilter = this.versionSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.versionFilter;
    // Reset the paginator to the first page
  }
}
