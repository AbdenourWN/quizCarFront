import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { Quiz, QuizService } from '../../../services/quiz.service';
import { Router } from '@angular/router';

export interface DialogData {
  price: number;
  payload: Quiz;
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogQuiz: MatDialog,
    private quizService: QuizService,
    private router: Router
  ) {}
  closeDialog() {
    this.dialogQuiz.closeAll();
  }
  saveQuiz() {
    this.quizService.addQuiz(this.data.payload).subscribe(
      (res) => {
        this.router.navigateByUrl('');
        alert('Quiz Saved Successfully');
        this.closeDialog();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
