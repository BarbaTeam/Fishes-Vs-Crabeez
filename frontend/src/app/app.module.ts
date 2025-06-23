////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';


////////////////////////////////////////////////////////////////////////////////
// Shared Module :

import { SharedModule } from './shared/shared.module';


////////////////////////////////////////////////////////////////////////////////
// Features' Modules :

// import { HomeModule } from './home/home.module';
// import { ChildModule } from './child/child.module';
// import { ErgoModule } from './ergo/ergo.module';

// NOTE : Those features modules are lazy loaded in `AppRoutingModule`.


////////////////////////////////////////////////////////////////////////////////
// AppModule :
////////////////////////////////////////////////////////////////////////////////

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,

        // Shared Module :
        SharedModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
