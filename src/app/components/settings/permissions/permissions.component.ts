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
import { PermissionService } from '../../../services/permission.service';
import { RoleService } from '../../../services/role.service';
import { FeatureService } from '../../../services/feature.service';
import { UpdateComponent } from './update/update.component';
export interface permission {
  _id: string;
  Get: boolean;
  Post: boolean;
  Patch: boolean;
  Delete: boolean;
  role: string;
  feature: string;
}
@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css',
})
export class PermissionsComponent implements OnInit, AfterViewInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private featureService: FeatureService
  ) {}

  permissions!: any[];
  permissionFilter!: any[];
  permissionSearch!: any[];
  displayedColumns: string[] = ['_id', 'Get','Post','Patch','Delete', 'role','feature', 'actions'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  roles!: any[];
  features!: any[];

  ngOnInit(): void {
    this.permissionService.watch().subscribe((res: any) => {
      this.searchBar = '';
      this.permissions = res;
      this.length = this.permissions.length;
      if (!this.roles) {
        this.roleService.watch().subscribe(
          (roles) => {
            this.roles = roles;
            this.permissions.forEach((permission) => {
              for (let i = 0; i < this.roles.length; i++) {
                const element = this.roles[i];
                if (permission.role === element._id) {
                  permission.role = element.role;
                }
              }
            });
          },
          (err) => console.log(err)
        );
      } else {
        this.permissions.forEach((permission) => {
          for (let i = 0; i < this.roles.length; i++) {
            const element = this.roles[i];
            if (permission.role === element._id) {
              permission.role = element.role;
            }
          }
        });
      }
      if (!this.features) {
        this.featureService.getFeatures().subscribe(
          (features: any) => {
            this.features = features;
            this.permissions.forEach((permission) => {
              for (let i = 0; i < this.features.length; i++) {
                const element = this.features[i];
                if (permission.feature === element._id) {
                  permission.feature = element.feature;
                }
              }
            });
          },
          (err) => console.log(err)
        );
      } else {
        this.permissions.forEach((permission) => {
          for (let i = 0; i < this.features.length; i++) {
            const element = this.features[i];
            if (permission.feature === element._id) {
              permission.feature = element.feature;
            }
          }
        });
      }
      this.permissionFilter = this.permissions.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.permissionFilter;
      // Additional logic to update the UI based on the new model data
    });
    this.permissionService.getPermissions();
    this.roleService.getRoles();
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
  openUpdatePermission(element: permission) {
    this.dialog.open(UpdateComponent, {
      data: {
        _id: element._id,
        Get:element.Get,
        Post:element.Post,
        Patch:element.Patch,
        Delete:element.Delete,
        role: element.role,
        feature: element.feature,
      },
    });
  }
  openDeletePermission(element: permission) {
    this.dialog.open(DeleteComponent, {
      data: {
        _id: element._id,
        Get:element.Get,
        Post:element.Post,
        Patch:element.Patch,
        Delete:element.Delete,
        role: element.role,
        feature: element.feature,
      },
    });
  }
  filterPermissions(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.permissionFilter = this.permissions.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.permissionFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the roles based on the name containing the input value
    this.permissionSearch = this.permissions.filter((permission) =>
      permission.feature.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.permissionSearch.length;
    // Update the data source with the filtered data
    this.permissionFilter = this.permissionSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.permissionFilter;
    // Reset the paginator to the first page
  }
}
