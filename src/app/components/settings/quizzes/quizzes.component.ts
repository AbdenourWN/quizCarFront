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
import { UserService } from '../../../services/user.service';
import { DetailsComponent } from './details/details.component';
import { DeleteQuizComponent } from './delete-quiz/delete-quiz.component';
import { QuizService } from '../../../services/quiz.service';
import { UserCRUDService } from '../../../services/user-crud.service';

export interface quiz {
  _id: string;
  name: string;
  type: string;
  result: string;
  createdBy: string;
  createdByName: string;
  quizQuestions: { question: string; response: string }[];
}
@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.css',
})
export class QuizzesComponent implements OnInit, AfterViewInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private userService: UserService,
    private quizService: QuizService,
    private userCRUDService: UserCRUDService
  ) {}

  quizzes!: any[];
  quizFilter!: any[];
  quizSearch!: any[];
  displayedColumns: string[] = [
    '_id',
    'name',
    'type',
    'result',
    'createdBy',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  permissions: any;
  users!: any[];
  quizPage = 'My Quizzes';
  thisUser: any;
  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (res) => {
        this.thisUser = res;
        if (res) this.quizService.getMyQuizzes(res.user._id);
      },
      (err) => console.log(err)
    );
    this.quizService.getItsPermission().subscribe(
      (res) => {
        this.permissions = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.quizService.watch().subscribe((res: any) => {
      this.searchBar = '';
      this.quizzes = res;
      this.length = this.quizzes.length;
      if (!this.users) {
        this.userCRUDService.watch().subscribe(
          (users) => {
            this.users = users;
            this.users.forEach((user) => {
              for (let quiz of this.quizzes) {
                if (user._id === quiz.createdBy) {
                  quiz.createdByName = user.fullName;
                }
              }
            });
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.users.forEach((user) => {
          for (let quiz of this.quizzes) {
            if (user._id === quiz.createdBy) {
              quiz.createdByName = user.fullName;
            }
          }
        });
      }
      this.quizFilter = this.quizzes.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.quizFilter;
      // Additional logic to update the UI based on the new model data
    });

    this.userCRUDService.getUsers();
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
  openDetails(element: quiz) {
    this.dialog.open(DetailsComponent, {
      data: {
        _id: element._id,
        name: element.name,
        type: element.type,
        result: element.result,
        createdBy: element.createdByName,
        quizQuestions: element.quizQuestions,
      },
    });
  }
  openDeleteQuiz(element: quiz) {
    this.dialog.open(DeleteQuizComponent, {
      data: {
        _id: element._id,
        name: element.name,
      },
    });
  }
  filterQuizzes(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.quizFilter = this.quizzes.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.quizFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the models based on the name containing the input value
    this.quizSearch = this.quizzes.filter((quiz) =>
      quiz.name.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.quizSearch.length;
    // Update the data source with the filtered data
    this.quizFilter = this.quizSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.quizFilter;
    // Reset the paginator to the first page
  }
  switchMine() {
    this.quizPage = 'My Quizzes';
    this.quizService.getMyQuizzes(this.thisUser?.user._id);
  }
  switchAll() {
    this.quizPage = 'All Quizzes';
    this.quizService.getQuizzes();
  }
}
