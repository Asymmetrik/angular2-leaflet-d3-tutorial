import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HexbinDemoComponent } from './hexbin/hexbin-demo.component';
import { DirectoryComponent } from './directory/directory.component';

@NgModule({
	imports: [
		RouterModule.forRoot([
			{
				path: '',
				component: DirectoryComponent
			},
			{
				path: 'hexbin',
				component: HexbinDemoComponent
			}
		], { useHash: true })
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
