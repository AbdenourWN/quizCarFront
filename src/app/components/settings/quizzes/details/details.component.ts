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
import { QuestionService } from '../../../../services/question.service';
export interface DialogDataQuiz {
  _id: string;
  name: string;
  type: string;
  result: string;
  createdBy: string;
  createdByName: string;
  quizQuestions: { question: string; response: string }[];
}
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataQuiz,
    public dialog: MatDialog,
    private questionService: QuestionService
  ) {}
  questions: any[] = [];
  ngOnInit(): void {
    this.questionService.watch().subscribe(
      (res) => {
        this.questions = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this.questionService.getQuestions();
  }
}
