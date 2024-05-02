import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserCRUDService } from '../../../services/user-crud.service';
import { Role, RoleService } from '../../../services/role.service';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DeleteComponent } from './delete/delete.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

export interface user {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  password: string;
  roleId: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, AfterViewInit {
  constructor(
    private userCRUDService: UserCRUDService,
    private _liveAnnouncer: LiveAnnouncer,
    private roleService: RoleService,
    public dialogUser: MatDialog,
    private userService: UserService
  ) {}

  thisUser: any;
  users!: any[];
  userFilter!: any[];
  userSearch!: any[];
  roles: any;
  displayedColumns: string[] = ['_id', 'fullName', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (res) => {
        this.thisUser = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this.userCRUDService.watch().subscribe((users: any) => {
      this.length = users.length;
      this.searchBar = '';
      this.users = users;
      if (!this.roles) {
        this.roleService.watch().subscribe(
          (res) => {
            this.roles = res;
            this.users.forEach((user) => {
              for (let i = 0; i < this.roles.length; i++) {
                const element = this.roles[i];
                if (user.role === element._id) {
                  user.role = element.role;
                  user.roleId = element._id;
                }
              }
            });
          },
          (err) => console.log(err)
        );
      } else {
        this.users.forEach((user) => {
          for (let i = 0; i < this.roles.length; i++) {
            const element = this.roles[i];
            if (user.role === element._id) {
              user.role = element.role;
              user.roleId = element._id;
            }
          }
        });
      }
      this.userFilter = this.users.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.userFilter;
      // Additional logic to update the UI based on the new user data
    });
    this.userCRUDService.getUsers();
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
  openCreateUser() {
    this.dialogUser.open(AddUserComponent, {
      data: null,
    });
  }
  openUpdateUser(element: user) {
    this.dialogUser.open(AddUserComponent, {
      data: {
        _id: element._id,
        fullName: element.fullName,
        email: element.email,
        password: element.password,
        role: element.roleId,
      },
    });
  }
  openDeleteUser(element: user) {
    this.dialogUser.open(DeleteComponent, {
      data: {
        _id: element._id,
        fullName: element.fullName,
      },
    });
  }
  filterUsers(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.userFilter = this.users.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.userFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the users based on the name containing the input value
    this.userSearch = this.users.filter((user) =>
      user.fullName.toLowerCase().includes(filterValue)
    );
    this.length = this.userSearch.length;
    this.index = 0;
    // Update the data source with the filtered data
    this.userFilter = this.userSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.userFilter;
    // Reset the paginator to the first page
  }
}
