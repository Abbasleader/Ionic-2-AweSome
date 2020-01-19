import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';

import { Place } from '../model/place.model';
import { MapLocation } from '../model/map-location.model';

const PLACES_KEY = 'places';
declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private places: Place[] = [];

  constructor(private storage: Storage, private file: File) { }

  addPlaces(
    title: string,
    description: string,
    location: MapLocation,
    imageUrl: string,
  ) {
    const place = new Place(title, description, new MapLocation(0, 0), imageUrl);
    this.places.push(place);
    this.storage.set(PLACES_KEY, this.places)
      .then()
      .catch(
        err => {
          this.places.splice(this.places.indexOf(place), 1);
        }
      );
  }

  loadPlaces() {
    return this.places.slice();
  }

  fetchPlaces() {
    return this.storage.get(PLACES_KEY)
      .then(
        (places: Place[]) => {
          this.places = places !== null ? places : [];
          return this.places.slice();
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      );
  }

  removePlace(index: number) {
    this.places.splice(index, 1);
    this.storage.set(PLACES_KEY, this.places)
      .then(
        () => {
          this.removeFile(this.places[index]);
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  allowDelete(allowId: number) {
    return allowId;
  }

  private removeFile(place: Place) {
    const currentName = place.imagePath.replace(/^.*[\\\/]/, '');
    this.file.removeFile(cordova.file.dataDirectory, currentName)
      .then(
        () => console.log('Removed File')
      )
      .catch(
        (err) => {
          console.log('Error while removing File');
          this.addPlaces(place.title, place.description, place.location, place.imagePath);
        }
      );
  }
}
