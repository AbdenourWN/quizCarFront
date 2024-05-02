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
import { AddRoleComponent } from './add-role/add-role.component';
import { DeleteRoleComponent } from './delete-role/delete-role.component';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

export interface role {
  _id: string;
  role: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit, AfterViewInit {
  constructor(
    private roleService: RoleService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private userService: UserService
  ) {}
  thisUser: any;
  roles!: any[];
  roleFilter!: any[];
  roleSearch!: any[];
  displayedColumns: string[] = ['_id', 'role', 'actions'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  permissions: any;
  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (res) => {
        this.thisUser = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.roleService.getItsPermission().subscribe(
      (res) => {
        this.permissions = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.roleService.watch().subscribe((res: any) => {
      this.searchBar = '';
      this.roles = res;
      this.length = this.roles.length;
      this.roleFilter = this.roles.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.roleFilter;
      // Additional logic to update the UI based on the new model data
    });
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
  openCreateRole() {
    this.dialog.open(AddRoleComponent, {
      data: null,
    });
  }
  openUpdateRole(element: role) {
    this.dialog.open(AddRoleComponent, {
      data: {
        _id: element._id,
        role: element.role,
      },
    });
  }
  openDeleteRole(element: role) {
    this.dialog.open(DeleteRoleComponent, {
      data: {
        _id: element._id,
        role: element.role,
      },
    });
  }
  filterRoles(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.roleFilter = this.roles.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.roleFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the models based on the name containing the input value
    this.roleSearch = this.roles.filter((role) =>
      role.role.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.roleSearch.length;
    // Update the data source with the filtered data
    this.roleFilter = this.roleSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.roleFilter;
    // Reset the paginator to the first page
  }
}
