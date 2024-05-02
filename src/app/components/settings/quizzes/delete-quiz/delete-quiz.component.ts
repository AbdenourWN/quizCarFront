import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { QuizService } from '../../../../services/quiz.service';
import { DialogDataQuiz } from '../details/details.component';

@Component({
  selector: 'app-delete-quiz',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './delete-quiz.component.html',
  styleUrl: './delete-quiz.component.css',
})
export class DeleteQuizComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataQuiz,
    private quizService:QuizService
  ) {}
  deleteQuiz() {
    this.quizService.deleteQuiz(this.data._id).subscribe(
      (res) => {
        this.quizService.socket$.next(res);
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
