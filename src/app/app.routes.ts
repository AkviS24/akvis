import { Routes } from '@angular/router';
import { MainPage } from './shared/pages/main-page/main-page';

export const routes: Routes = [
    {
        path: '', component: MainPage
    },
    {
        path: '**', redirectTo: '', pathMatch: 'full'
    }
];
