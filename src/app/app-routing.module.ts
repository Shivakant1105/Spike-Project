import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth', canActivate: [LoginGuard],
    loadChildren: () => import("./auth/auth.module").then((x) => {
      return x.AuthModule
    })
  },
  {
    path: 'home', canActivate: [AuthGuard],
    loadChildren: () => import("./home-module/home-module.module").then((x) => {
      return x.HomeModuleModule
    })
  },
  {
    path: 'menu', canActivate: [AuthGuard],
    loadChildren: () => import("./menu-module/menu-module.module").then((x) => {
      return x.MenuModuleModule
    })
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
