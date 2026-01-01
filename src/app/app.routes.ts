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
                            },
                            {
                              path: 'programas-educativos',
                              loadComponent: () =>
                                import('./layout/admin/programasEducativos/pages/programas-educativos-list')
                                  .then(m => m.ProgramaEducativoListComponent)
                            },
                            {
                              path: 'programas-educativos/crear',
                              loadComponent: () =>
                                import('./layout/admin/programasEducativos/pages/programas-educativos-form')
                                  .then(m => m.ProgramaEducativoFormComponent)
                            },
                            {
                              path: 'programas-educativos/editar/:id',
                              loadComponent: () =>
                                import('./layout/admin/programasEducativos/pages/programas-educativos-form')
                                  .then(m => m.ProgramaEducativoFormComponent)
                            },
                            {
                              path: 'experiencias-educativas',
                              loadComponent: () =>
                                import('./layout/admin/experienciasEducativas/pages/experiencia-educativa-list')
                                  .then(m => m.ExperienciaEducativaList)
                            },
                            {
                              path: 'experiencias-educativas/crear',
                              loadComponent: () =>
                                import('./layout/admin/experienciasEducativas/pages/experiencias-educativas-form')
                                  .then(m => m.ExperienciasEducativasForm)
                            },
                            {
                              path: 'experiencias-educativas/editar/:id',
                              loadComponent: () =>
                                import('./layout/admin/experienciasEducativas/pages/experiencias-educativas-form')
                                  .then(m => m.ExperienciasEducativasForm)
                            },
                            {
                              path: 'cursos',
                              loadComponent: () =>
                                import('./layout/admin/cursos/pages/cursos-list')
                                  .then(m => m.CursosList)
                            },
                            {
                              path: 'cursos/crear',
                              loadComponent: () =>
                                import('./layout/admin/cursos/pages/cursos-form')
                                  .then(m => m.CursosForm)
                            },
                            {
                              path: 'cursos/editar/:id',
                              loadComponent: () =>
                                import('./layout/admin/cursos/pages/cursos-form')
                                  .then(m => m.CursosForm)
                            },
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
