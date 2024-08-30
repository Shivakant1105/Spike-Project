import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import("./home-module/home-module.module").then((x) => {
      return x.HomeModuleModule
    })
  },
  {
    path: 'menu',
    loadChildren: () => import("./menu-module/menu-module.module").then((x) => {
      return x.MenuModuleModule
    })
  },
  {
    path: 'auth',
    loadChildren: () => import("./auth/auth.module").then((x) => {
      return x.AuthModule
    })
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
