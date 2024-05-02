import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { ModelService } from '../../../services/model.service';
import { VersionService } from '../../../services/version.service';
import { FeatureService } from '../../../services/feature.service';
import { PermissionService } from '../../../services/permission.service';
import { QuestionService } from '../../../services/question.service';
import { QuizService } from '../../../services/quiz.service';
import { RoleService } from '../../../services/role.service';
import { UserCRUDService } from '../../../services/user-crud.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private brandService: BrandService,
    private modelService: ModelService,
    private versionService: VersionService,
    private featureService: FeatureService,
    private permissionService: PermissionService,
    private questionService: QuestionService,
    private quizService: QuizService,
    private roleService: RoleService,
    private userCRUDService: UserCRUDService
  ) {}
  data: any = [
    { type: 'Users', num: 0 },
    { type: 'Brands', num: 0 },
    { type: 'Models', num: 0 },
    { type: 'Versions', num: 0 },
    { type: 'Features', num: 0 },
    { type: 'Permissions', num: 0 },
    { type: 'Questions', num: 0 },
    { type: 'Quizzes', num: 0 },
    { type: 'Roles', num: 0 },
  ];
  ngOnInit(): void {
    this.userCRUDService.getUsers();
    this.brandService.getBrands();
    this.modelService.getModels();
    this.versionService.getVersions();
    this.permissionService.getPermissions();
    this.quizService.getQuizzes();
    this.roleService.getRoles();

    this.userCRUDService.watch().subscribe(
      (res) => {
        this.data[0].num = res.length;
      },
      (err) => {
        console.log(err);
      }
    );
    this.brandService.watch().subscribe(
      (res: any) => {
        this.data[1].num = res.length;
      },
      (err) => console.log(err)
    );
    this.modelService.watch().subscribe(
      (res: any) => {
        this.data[2].num = res.length;
      },
      (err) => console.log(err)
    );
    this.versionService.watch().subscribe(
      (res: any) => {
        this.data[3].num = res.length;
      },
      (err) => console.log(err)
    );
    this.featureService.getFeatures().subscribe(
      (res: any) => {
        this.data[4].num = res.length;
      },
      (err) => console.log(err)
    );
    this.permissionService.watch().subscribe(
      (res: any) => {
        this.data[5].num = res.length;
      },
      (err) => console.log(err)
    );
    this.questionService.getQuestions().subscribe(
      (res: any) => {
        this.data[6].num = res.length;
      },
      (err) => console.log(err)
    );
    this.quizService.watch().subscribe(
      (res: any) => {
        this.data[7].num = res.length;
      },
      (err) => console.log(err)
    );
    this.roleService.watch().subscribe(
      (res: any) => {
        this.data[8].num = res.length;
      },
      (err) => console.log(err)
    );
  }
}
