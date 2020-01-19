import { Component, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  GoogleMaps,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { HomeService } from '../home.service';


@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.page.html',
  styleUrls: ['./set-location.page.scss'],
})
export class SetLocationPage implements OnInit, OnDestroy {
  image: any = '';
  subscription: Subscription;

  constructor(
    private platform: Platform,
    private geoLocation: Geolocation,
    private homService: HomeService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {
    const map = GoogleMaps.create('map');
    map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

      this.geoLocation.getCurrentPosition().then((resp) => {

        const coordinates: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);

        const position = {
          target: coordinates,
          zoom: 16
        };

        map.animateCamera(position);

        const markerOptions: MarkerOptions = {
          position: coordinates,
          title: 'Hello Mahdi, Are you here?'
        };

        const marker = map.addMarker(markerOptions).then((marker: Marker) => {
          marker.showInfoWindow();
        });

        this.subscription = map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data: any) => {

          console.log(data);

          map.clear();

          const latLng = data + '';
          const numLat = +latLng.indexOf(' ');
          const numLatTwo = +latLng.indexOf(',');

          const numLng = +latLng.lastIndexOf(' ');
          const numLngTwo = +latLng.lastIndexOf('}');

          const latitude = +latLng.slice(numLat + 1, numLatTwo);
          const longtitude = +latLng.slice(numLng + 1, numLngTwo);

          // this.homService.latitude = latitude;
          // this.homService.longtitude = longtitude;

          const coordinatesClick: LatLng = new LatLng(latitude, longtitude);

          const positionClick = {
            target: coordinatesClick,
            zoom: 16
          };

          map.animateCamera(positionClick);

          const markerOptionsClick: MarkerOptions = {
            position: coordinatesClick,
            title: 'Hello Mahdi, Are you here?'
          };

          const marker = map.addMarker(markerOptionsClick).then((marker: Marker) => {
            marker.showInfoWindow();
          });
        });

      }).catch((error) => {
        console.log('Error getting location', error);
      });

    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
