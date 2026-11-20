import { Routes } from '@angular/router';
import { MainPage } from './shared/pages/main-page/main-page';
import { LegalNotice } from './shared/pages/legal-notice/legal-notice';
import { PrivacyPolicy } from './shared/pages/privacy-policy/privacy-policy';
import { PasswordReset } from './shared/pages/password-reset/password-reset';
import { Activation } from './shared/pages/activation/activation';

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
        path: 'activate/:uid/:token', component: Activation
    },
    {
        path: 'password-reset/:uid/:token', component: PasswordReset
    },
    {
        path: '**', redirectTo: '', pathMatch: 'full'
    }
];
