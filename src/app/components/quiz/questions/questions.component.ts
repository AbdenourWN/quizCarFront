import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { elementAt } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ResultComponent } from '../result/result.component';
import { QuestionService } from '../../../services/question.service';
import { BrandService } from '../../../services/brand.service';
import { Model, ModelService } from '../../../services/model.service';
import { error } from 'console';
import { response } from 'express';
import { UserService } from '../../../services/user.service';
import { LoadingDialogComponent } from '../../loading/loading-dialog-component';

@Component({
  selector: 'questions',
  standalone: true,
  imports: [
    MatButtonModule,
    HttpClientModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private questionService: QuestionService,
    private brandService: BrandService,
    private modelService: ModelService,
    private http: HttpClient,
    private userService: UserService
  ) {}
  thisUser: any;
  questions: any = [];
  formGroups: FormGroup[] = [];
  dropdowns: any = {
    brand: [],
    model: [],
    const: {
      Energie: [
        'Essence',
        'Hybride',
        'Diesel',
        'Electrique',
        'Hybride essence',
        'Hybride rechargeable essence',
        'Hybride rechargeable diesel',
        'Hybride diesel',
      ],
      'Boite vitesse': ['Manuelle', 'Automatique'],
    },
  };
  models: any;
  @Input() quiz: any;
  @Input() quizPage: any;
  @Output() quizPageChange = new EventEmitter<any>();
  showError = false;
  ngOnInit() {
    this.userService.getUser().subscribe(
      (response: any) => {
        this.thisUser = response;
      },
      (err) => console.log(err)
    );
    this.questionService.getQuestions().subscribe(
      (response) => {
        this.questions = response;
        this.createFormGroups();
      },
      (error: any) => {
        alert(error.message);
      }
    );
    this.brandService.getBrands();
    this.modelService.getModels();

    this.brandService.watch().subscribe(
      (res) => {
        this.dropdowns.brand = res;
      },
      (error) => {
        console.error(error);
        alert(error);
      }
    );

    this.modelService.watch().subscribe(
      (res) => {
        this.models = res;
      },
      (error) => {
        console.error(error);
        alert(error);
      }
    );
  }
  handleChange(event: Event) {
    const e = event.target as HTMLInputElement;
    if (e.id.includes('Marque')) this.brandChange(event);
    else if (e.id.includes('Modele')) this.modelChange(event);
  }
  brandChange(event: Event) {
    const brand = event.target as HTMLInputElement;
    const brandId = brand.value;
    this.dropdowns.model = this.models.filter((model: Model) => {
      let id;
      for (const b of this.dropdowns.brand) {
        if (brandId === b.brand) {
          id = b._id;
          break;
        }
      }
      return id === model.brand;
    });
  }
  modelChange(event: Event) {
    const model = event.target as HTMLInputElement;
    const modelId = model.value;
  }
  enableError() {
    this.showError = true;
  }
  disableError() {
    this.showError = false;
  }

  openDialog() {
    this.showError = false;
    const formGroupsAsObject = this.formGroups.map((formGroup) =>
      formGroup.getRawValue()
    );

    let quizQuestions: any[] = [];

    let predictionPayload: any = {};

    let questionCounter = 0;
    formGroupsAsObject.forEach((group) => {
      const keys = Object.keys(group);

      keys.forEach((questionId) => {
        const questionText = this.questions[questionCounter].question;
        const responseValue = group[questionId];

        quizQuestions.push({ question: questionId, response: responseValue });

        switch (questionText) {
          case 'Marque':
            predictionPayload.marque = responseValue;
            break;
          case 'Modele':
            predictionPayload.modele = responseValue;
            break;
          case 'Puissance fiscale (cv)':
            predictionPayload.puissance_fiscale = Number(responseValue);
            break;
          case 'Kilometrage':
            predictionPayload.kilometrage = Number(responseValue);
            break;
          case 'Annee':
            predictionPayload.annee = Number(responseValue);
            break;
          case 'Energie':
            predictionPayload.energie = responseValue;
            break;
          case 'Boite vitesse':
            predictionPayload.boite = responseValue;
            break;
        }
        questionCounter++;
      });
    });

    console.log('Sending this payload to prediction API:', predictionPayload);

    const loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true, // Prevent the user from closing it
    });

    this.http
      .post(
        'https://car-price-api-vfb0.onrender.com/predict',
        predictionPayload
      )
      .subscribe(
        (res: any) => {

          loadingDialogRef.close();

          const predictedPrice = Math.ceil(res.predicted_price);

          this.dialog.open(ResultComponent, {
            data: {
              price: predictedPrice,
              payload: {
                name: this.quiz.name,
                result: predictedPrice,
                quizQuestions: quizQuestions,
                createdBy: this.thisUser.user._id,
              },
            },
          });
        },
        (err) => {

          loadingDialogRef.close();

          console.error('API Error:', err);
          alert(
            'Sorry, there was an error getting the price prediction. Please try again later.'
          );
        }
      );
  }
  createFormGroups() {
    const numberOfGroups = Math.ceil(this.questions.length / 5);
    for (let i = 0; i < numberOfGroups; i++) {
      const group = this._formBuilder.group({});
      for (let j = 0; j < 5; j++) {
        const questionIndex = i * 5 + j;
        if (questionIndex < this.questions.length) {
          const questionId = this.questions[questionIndex]._id;
          group.addControl(
            String(questionId),
            this._formBuilder.control('', Validators.required)
          );
        }
      }
      this.formGroups.push(group);
    }
  }
  goBack() {
    this.quizPageChange.emit(1);
  }
}
