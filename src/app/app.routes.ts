import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', 
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'admin',
                canActivate: [roleGuard('ROLE_ADMINISTRADOR')],
                children: [
                            {
                              path: 'usuarios',
                              loadComponent: () =>
                                import('./layout/admin/usuarios/pages/user-list.component')
                                  .then(m => m.UserListComponent)
                            },
                            {
                              path: 'usuarios/crear',
                              loadComponent: () =>
                                import('./layout/admin/usuarios/pages/user-form.component')
                                  .then(m => m.UserFormComponent)
                            },
                            {
                              path: 'usuarios/editar/:id',
                              loadComponent: () =>
                                import('./layout/admin/usuarios/pages/user-form.component')
                                  .then(m => m.UserFormComponent)
                            }
                        ],
                loadComponent: () => 
                    import('./layout/admin/admin.component')
                .then(m => m.AdminComponent), 
            },
    {
        path: 'profesor',
        canActivate: [roleGuard('ROLE_PROFESOR')],
        loadComponent: () => 
            import('./layout/profesor/profesor.component')
        .then(m => m.ProfesorComponent)
    }
        ]
    },  

    {path: '**', redirectTo: 'login'}

];
