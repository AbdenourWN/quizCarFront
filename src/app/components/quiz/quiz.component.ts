import { Component } from '@angular/core';
import { StartQuizComponent } from './start-quiz/start-quiz.component';
import { QuestionsComponent } from './questions/questions.component';
import { StorageService } from '../../services/storage.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [StartQuizComponent, QuestionsComponent,LoadingComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent {
  token: any = null;
  constructor(private storage: StorageService) {
    this.token = storage.getToken();
  }

  quiz: any;
  quizPage = 1;
  changeQuizPage() {
    if (this.quizPage === 1) this.quizPage = 2;
    else if (this.quizPage === 2) this.quizPage = 1;
  }
}
