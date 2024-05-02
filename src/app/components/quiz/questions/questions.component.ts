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
import { Version, VersionService } from '../../../services/version.service';
import { Model, ModelService } from '../../../services/model.service';
import { error } from 'console';
import { response } from 'express';
import { UserService } from '../../../services/user.service';

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
    private versionService: VersionService,
    private http: HttpClient,
    private userService: UserService
  ) {}
  thisUser: any;
  questions: any = [];
  formGroups: FormGroup[] = [];
  dropdowns: any = {
    brand: [],
    model: [],
    version: [],
    const: {
      Energie: [
        'Essence',
        'Diesel',
        'Hybride essence',
        'Hybride diesel',
        'Electrique',
      ],
      'Boite vitesse': ['Manuelle', 'Automatique'],
      'Couleur exterieur': [
        'Noir',
        'Blanc',
        'Gris anthracite',
        'Bleu',
        'Marron',
        'Gris argent',
        'Rouge',
        'Autre',
        'Beige',
        'Aubergine',
        'Gris Shark',
        'Vert',
      ],
      'Couleur interieur': [
        'Noir',
        'Marron',
        'Gris',
        'Beige',
        'Rouge',
        'Autre',
      ],
      'Puissance fiscale (cv)': [
        4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24,
        27, 30, 33, 43, 48,
      ],
      Transmission: ['Traction', 'Integrale', 'Propulsion'],
      Carrosserie: [
        'Compacte',
        'SUV/4x4',
        'Coupe',
        'Berline',
        'Citadine',
        'Utilitaire',
        'Monospace',
        'Pick up',
        'Autres',
      ],
      'Nombre de places': [2, 3, 4, 5, 6, 7, 8],
      Condition: ['Presque Nouveau', 'Bon', 'Moyenne', 'Mal'],
      'Nombre de portes': [2, 3, 4, 5],
      Sallerie: [
        'Cuir integral',
        'Alcantara',
        'Tissu',
        'Similicuir',
        'Cuir partiel',
        'Velours',
      ],
      'Engine Volume': [
        0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3,
        1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7,
        2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.2,
        4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.0, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8,
        5.9, 6.0, 6.2, 6.3, 6.4, 6.7, 6.8, 7.3, 20.0,
      ],
    },
  };
  models: any;
  versions: any;
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
    if (this.quiz.type === 'Slow') {
      this.questionService.getQuestions().subscribe(
        (response) => {
          this.questions = response;
          this.createFormGroups();
        },
        (error: any) => {
          alert(error.message);
        }
      );
    } else {
      this.questionService.getFastQuestions().subscribe(
        (response) => {
          this.questions = response;
          this.createFormGroups();
        },
        (error: any) => {
          alert(error.message);
        }
      );
    }
    this.brandService.getBrands();
    this.modelService.getModels();
    this.versionService.getVersions();

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
    this.versionService.watch().subscribe(
      (res) => {
        this.versions = res;
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
    this.dropdowns.version = this.versions.filter((version: Version) => {
      let id;
      for (const m of this.dropdowns.model) {
        if (modelId === m.model) {
          id = m._id;
          break;
        }
      }
      return id === version.model;
    });
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
    let data: any[] = [];
    formGroupsAsObject.forEach((element, i) => {
      const keys = Object.keys(element);
      keys.forEach((key, j) => {
        var reg = /^\d+$/;
        let num = parseFloat(element[key]);
        const number = Math.ceil(num);
        if (
          !reg.test(element[key]) ||
          isNaN(num) ||
          element[key].trim() === ''
        ) {
          quizQuestions.push({ question: key, response: element[key] });
          data.push(element[key]);
        } else {
          quizQuestions.push({ question: key, response: number });
          data.push(number);
        }
      });
    });
    this.http
      .post(`http://127.0.0.1:5000/${this.quiz.type}`, {
        data: data,
      })
      .subscribe(
        (res: any) => {
          this.dialog.open(ResultComponent, {
            data: {
              price: Math.ceil(res.price),
              payload: {
                name: this.quiz.name,
                type: this.quiz.type,
                result: Math.ceil(res.price),
                quizQuestions: quizQuestions,
                createdBy: this.thisUser.user._id,
              },
            },
          });
        },
        (err) => {
          console.log(err);
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
