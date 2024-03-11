import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreatedComponent } from "./posts/post-created/post-created.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { authGuard } from "./auth/auth.guard";

const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostCreatedComponent, canActivate: [authGuard] },
    { path: 'edit/:postId', component: PostCreatedComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
];

@NgModule ({
    imports: [
        RouterModule.forRoot (routes)
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {

} // AppRoutingModule
