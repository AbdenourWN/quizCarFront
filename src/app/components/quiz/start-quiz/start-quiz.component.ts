import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';


@Component({
  selector: 'start-quiz',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './start-quiz.component.html',
  styleUrl: './start-quiz.component.css',
})
export class StartQuizComponent {
  quizName = new FormControl('', [Validators.required]);
  showError = false;
  @Input() quizPage: any;
  @Output() quizPageChange = new EventEmitter<any>();
  @Output() quiz = new EventEmitter<any>();
  onSubmit() {
    if (this.quizName.valid) {
      this.showError = false;
      this.quiz.emit({ name: this.quizName.value });
      this.quizPageChange.emit(2);
    } else {
      this.showError = true;
      console.log('Quiz name is required.');
    }
  }
}
