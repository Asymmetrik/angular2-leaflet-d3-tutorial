import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { LeafletD3Module } from '@asymmetrik/angular2-leaflet-d3';

import { HexbinDemoComponent } from './hexbin-demo.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		LeafletModule,
		LeafletD3Module
	],
	declarations: [
		HexbinDemoComponent
	],
	exports: [
		HexbinDemoComponent
	],
	bootstrap: [ HexbinDemoComponent ],
	providers: [ ]
})
export class HexbinDemoModule { }
