import { Routes } from '@angular/router';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { StudentFormComponent } from './pages/student-form/student-form.component';
import { StudentFicheComponent } from './pages/student-fiche/student-fiche.component';
import{StudentPaimentComponent} from './pages/student-paiment/student-paiment.component'

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
    },
    {
        path:"students/form",
        component :StudentFormComponent
    },
    {
        path:"students/fiche",
        component :StudentFicheComponent
    },
    {
        path:"students/paiment",
        component:StudentPaimentComponent
    }


];
