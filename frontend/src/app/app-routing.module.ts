import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
    // Redirecting root to home :
    { path: "", redirectTo: "home", pathMatch: "full",},

    // Lazy loading sub-routing modules :
    {
        path: "home",
        loadChildren: () => import(
            "@app/home/home.module"
        ).then(
            m => m.HomeModule
        ),
    }, {
        path: "child",
        loadChildren: () => import(
            "@app/child/child.module"
        ).then(
            m => m.ChildModule
        ),
    }, {
        path: "ergo",
        loadChildren: () => import(
            "@app/ergo/ergo.module"
        ).then(
            m => m.ErgoModule
        ),
    },
];



@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
