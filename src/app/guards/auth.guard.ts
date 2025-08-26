import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthComponent } from '../components/auth/auth.component';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';
import { UserCRUDService } from '../services/user-crud.service';
import { BrandService } from '../services/brand.service';
import { ModelService } from '../services/model.service';
import { RoleService } from '../services/role.service';

export const QuizGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(StorageService);
  if (storage.getToken()) {
    return true;
  } else {
    router.navigateByUrl('Login');
    return false;
  }
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(StorageService);
  if (storage.getToken()) {
    router.navigateByUrl('Quiz');
    return false;
  } else {
    return true;
  }
};
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  let user: any;
  userService.getUser().subscribe(
    (res: any) => (user = res),
    (err) => console.log(err)
  );
  if (user?.role?.role === 'admin') {
    return true;
  } else {
    router.navigateByUrl('settings/settings');
    return false;
  }
};
export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const serviceType = route.data['service'];
  let service: any;
  let permission: Boolean;
  switch (serviceType) {
    case 'users':
      service = inject(UserCRUDService);
      break;
    case 'brands':
      service = inject(BrandService);
      break;
    case 'models':
      service = inject(ModelService);
      break;
    case 'roles':
      service = inject(RoleService);
      break;
    default:
      return false;
  }
  return new Promise((resolve, reject) => {
    service.getItsPermission().subscribe(
      (res: any) => {
        const permission = res;
        if (permission?.Post || permission?.Delete || permission?.Patch) {
          resolve(true);
        } else {
          router.navigateByUrl('settings/settings');
          resolve(false);
        }
      },
      (err: any) => {
        console.log(err);
        router.navigateByUrl('settings/settings');
        resolve(false);
      }
    );
  });
};
