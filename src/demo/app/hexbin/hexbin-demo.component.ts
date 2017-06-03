import { Component, OnInit } from '@angular/core';

import './hexbin-demo.component.scss';

import * as L from 'leaflet';
import * as xml2js from 'xml2js';

import '@asymmetrik/leaflet-d3';

@Component({
	selector: 'hexbin-demo',
	templateUrl: './hexbin-demo.component.html'
})
export class HexbinDemoComponent
implements OnInit {

	// BaseLayer Defs
	maps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
		detectRetina: true
	});
	hybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
		detectRetina: true
	});

	// Set of layers initially visible
	layers: L.Layer[];

	// The hexLayer Objects
	hexLayers: any[] = [];

	// Layer control
	layersControl: any;

	// Current fitBounds for map
	fitBounds: L.LatLngBounds;

	options = {
		zoom: 2,
		center: L.latLng([ 46.879966, -121.726909 ])
	};

	dimensions: any = [
		{
			label: 'Time since start',
			fn: this.avg((d: any) => { return d.ts; })
		},
		{
			label: 'Number of samples',
			fn: (b: any[]) => {
				return b.length;
			}
		},
		{
			label: 'Heart Rate',
			fn: this.avg((d: any) => { return d.hr; })
		}
	];

	model = {
		colorDimension: this.dimensions[0],
		radiusDimension: this.dimensions[0]
	};


	ngOnInit() {
		this.layers = [ this.maps ];
		this.layersControl = {
			baseLayers: {
				Maps: this.maps,
				Hybrid: this.hybrid
			},
			overlays: {}
		};
	}

	avg(fn: (d: any) => number ) {
		return (b: any[]) => {
			let sum = b.map((d: any) => {
				return fn(d.o);
			}).reduce((p: number, c: number) => {
				return p + c;
			}, 0);

			return sum / b.length;
		};
	}

	transformPoint(d: any) {
		let toReturn: any = {};

		toReturn.lat = +d.$.lat;
		toReturn.lng = +d.$.lon;
		toReturn.hr = +d.extensions[0]['gpxtpx:TrackPointExtension'][0]['gpxtpx:hr'][0];
		toReturn.elevation = +d.ele[0];
		toReturn.temp = d.extensions[0]['gpxtpx:TrackPointExtension'][0]['gpxtpx:atemp'][0];
		toReturn.ts = new Date(d.time).getTime();

		return toReturn;
	}

	loadFile() {
		let input: any = document.getElementById('fileInput');

		if (null != input) {
			let file = input.files[0];
			let fr = new FileReader();

			fr.onload = () => {

				xml2js.parseString( fr.result, (err: any, result: any) => {
					if (null == err) {

						let name = result.gpx.trk[0].name[0];
						let points = result.gpx.trk[0].trkseg[0].trkpt.map(this.transformPoint);
						let polyline = L.polyline(points.map((d: any) => { return [ d.lat, d.lng ]; }), { color: 'red' });
						let hexLayer = this.generateLayer(name, points);

						// Update the layers control
						this.layersControl = {
							baseLayers: this.layersControl.baseLayers,
							overlays: {
								'Path Layer': polyline
							}
						};

						// Push the new layers to the map
						this.hexLayers.push(hexLayer);
						this.layers.push(polyline);

						// Update the fitBounds
						this.fitBounds = polyline.getBounds();
					}
				});

			};

			fr.readAsText(file);
		}
	}

	generateLayer(name: string, points: any[]): any {

		let toReturn: any = {
			name,
			options: {
				radius: 10,
				opacity: 0.7,
				radiusRange: [ 4, 9 ],
				radiusScaleExtent: [ undefined, undefined ],
				colorScaleExtent: [ undefined, undefined ],
				colorRange: [ 'steelblue', 'tomato' ]
			},
			data: points,
			ready: (hexLayer: L.HexbinLayer) => {
				hexLayer.lat((d: any) => { return d.lat; });
				hexLayer.lng((d: any) => { return d.lng; });

				hexLayer.radiusValue((d: any) => { return this.model.radiusDimension.fn(d); });
				hexLayer.colorValue((d: any) => { return this.model.colorDimension.fn(d); });

				// Update the layers control now that we have a reference to the hex layer
				this.layersControl = {
					baseLayers: this.layersControl.baseLayers,
					overlays: {
						'Path Layer': this.layersControl.overlays['Path Layer'],
						'Hexbin Layer': hexLayer
					}
				};
			}
		};
		return toReturn;

	}
}
