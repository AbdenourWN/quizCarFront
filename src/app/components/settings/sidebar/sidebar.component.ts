import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../../services/user.service';
import { BrandService } from '../../../services/brand.service';
import { ModelService } from '../../../services/model.service';
import { FeatureService } from '../../../services/feature.service';
import { PermissionService } from '../../../services/permission.service';
import { QuestionService } from '../../../services/question.service';
import { QuizService } from '../../../services/quiz.service';
import { RoleService } from '../../../services/role.service';
import { UserCRUDService } from '../../../services/user-crud.service';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private brandService: BrandService,
    private modelService: ModelService,
    private featureService: FeatureService,
    private permissionService: PermissionService,
    private questionService: QuestionService,
    private quizService: QuizService,
    private roleService: RoleService,
    private userCRUDService: UserCRUDService
  ) {}
  getUrl() {
    return this.router.url;
  }
  user: any;
  permissions: any = {
    brand: {},
    model: {},
    quiz: {},
    user: {},
    role: {},
  };
  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (res) => (this.user = res),
      (err) => console.log(err)
    );
    this.brandService.getItsPermission().subscribe(
      (res) => {
        this.permissions.brand = res;
      },
      (err) => console.log(err)
    );
    this.modelService.getItsPermission().subscribe(
      (res) => (this.permissions.model = res),
      (err) => console.log(err)
    );
    this.roleService.getItsPermission().subscribe(
      (res) => (this.permissions.role = res),
      (err) => console.log(err)
    );
    this.userCRUDService.getItsPermission().subscribe(
      (res) => (this.permissions.user = res),
      (err) => console.log(err)
    );
  }
}
