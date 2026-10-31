import { Routes } from '@angular/router';
import { MainPage } from './shared/pages/main-page/main-page';
import { LegalNotice } from './shared/pages/legal-notice/legal-notice';
import { PrivacyPolicy } from './shared/pages/privacy-policy/privacy-policy';

export const routes: Routes = [
    {
        path: '', component: MainPage
    },
    {
        path: 'legal-notice', component: LegalNotice
    },
    {
        path: 'privacy-policy', component: PrivacyPolicy
    },
    {
        path: '**', redirectTo: '', pathMatch: 'full'
    }
];
