import { Routes } from '@angular/router';
import { StudentListComponent } from './pages/student-list/student-list.component';

export const routes: Routes = [
    //la route par defaut
    {
        path:"",
        redirectTo:"students",
        pathMatch:"full"
    },
    {
        path:"students",
        component:StudentListComponent
    }
];
