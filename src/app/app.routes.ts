import { Routes }       from '@angular/router';

// Pages
import { Dashboard }    from './pages/dashboard/dashboard';
import { Error }        from './pages/error/error';
import { License }      from './pages/license/license';

export const routes: Routes = [
    {path: "license",   component: License},
    {path: "",          component: Dashboard},
    {path: "**",        component: Error}
];
