import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { UserGuardGuard } from './utils/user-guard.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: ListUsersComponent},         // Ruta protegida
  { path: '', redirectTo:'home', pathMatch:'full' },        // Ruta vacía: redirige a la pantalla de Home 
  { path: '**', redirectTo:'home', pathMatch:'full'}        // Ruta inexistente: redirige a la pantalla de Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
