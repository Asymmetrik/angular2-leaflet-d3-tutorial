import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DirectoryComponent } from './directory.component';

@NgModule({
	imports: [
		RouterModule
	],
	declarations: [
		DirectoryComponent
	],
	exports: [
		DirectoryComponent
	],
	bootstrap: [ DirectoryComponent ],
	providers: [ ]
})
export class DirectoryModule { }
