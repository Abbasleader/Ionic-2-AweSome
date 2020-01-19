import { Component, OnInit } from '@angular/core';

import { Place } from '../model/place.model';
import { HomeService } from './home.service';
import { ModalController } from '@ionic/angular';
import { SinglePlaceComponent } from './single-place/single-place.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  places: Place[] = null;

  constructor(private homeService: HomeService, private modalController: ModalController) {
  }

  ngOnInit() {
    this.homeService.fetchPlaces();
  }

  ionViewWillEnter() {
    this.places = this.homeService.loadPlaces();
  }

  onOpenPlace(place: Place, index: number) {
    console.log(index);
    this.presentModal(place, index);
  }

  async presentModal(place: Place, index: number) {
    const modal = await this.modalController.create({
      component: SinglePlaceComponent,
      componentProps: { place, id: index }
    });
    return await modal.present();
  }
}
