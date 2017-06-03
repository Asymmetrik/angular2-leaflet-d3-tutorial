import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HexbinDemoModule } from './hexbin/hexbin-demo.module';
import { DirectoryModule } from './directory/directory.module';


@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		DirectoryModule,
		HexbinDemoModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [ AppComponent ],
	providers: [ ]
})
export class AppModule { }
