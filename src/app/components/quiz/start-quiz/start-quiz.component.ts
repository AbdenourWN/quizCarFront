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
  type = 'Slow';
  changeType = (event:Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (this.type === 'Fast' && inputElement.id !=="Fast" ) this.type = 'Slow';
    else if (this.type === 'Slow'&& inputElement.id !=="Slow") this.type = 'Fast';
  };
  onSubmit() {
    if (this.quizName.valid) {
      this.showError = false;
      this.quiz.emit({ name: this.quizName.value, type: this.type });
      this.quizPageChange.emit(2);
    } else {
      this.showError = true;
      console.log('Quiz name is required.');
    }
  }
}
