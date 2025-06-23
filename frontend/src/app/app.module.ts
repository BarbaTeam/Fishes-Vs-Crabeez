////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
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
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,

        AppRoutingModule,

        // Shared Module :
        SharedModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
