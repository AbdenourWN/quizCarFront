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
import { QuestionService } from '../../../services/question.service';
@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule,FormsModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit, AfterViewInit {
  constructor(
    private questionService: QuestionService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
  ) {}
  questions!: any[];
  questionsFilter!: any[];
  questionSearch!: any[];
  displayedColumns: string[] = ['_id', 'question'];
  dataSource = new MatTableDataSource();
  index = 0;
  pageEvent!: PageEvent;
  pageSize = 5;
  searchBar!: string;
  length!: number;
  permissions: any;
  ngOnInit(): void {
    this.questionService.getQuestions().subscribe((res: any) => {
      this.searchBar = '';
      this.questions = res;
      this.length = this.questions.length;
      this.questionsFilter = this.questions.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      );
      this.dataSource.data = this.questionsFilter;
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
  filterQuestions(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex;
    this.questionsFilter = this.questions.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.questionsFilter;
    return event;
  }
  filterByName() {
    // Convert the input value to lowercase for case-insensitive matching
    const filterValue = this.searchBar.trim().toLowerCase();
    // Filter the models based on the name containing the input value
    this.questionSearch = this.questions.filter((question) =>
      question.question.toLowerCase().includes(filterValue)
    );
    this.index = 0;
    this.length = this.questionSearch.length;
    // Update the data source with the filtered data
    this.questionsFilter = this.questionSearch.slice(
      this.index * this.pageSize,
      (this.index + 1) * this.pageSize
    );
    this.dataSource.data = this.questionsFilter;
    // Reset the paginator to the first page
  }
}
