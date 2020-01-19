import { Component, OnInit, Input } from '@angular/core';
import { Place } from '../../model/place.model';
import { ModalController } from '@ionic/angular';
import { HomeService } from '../home.service';
import { HomePage } from '../home.page';

@Component({
  selector: 'app-single-place',
  templateUrl: './single-place.component.html',
  styleUrls: ['./single-place.component.scss'],
})
export class SinglePlaceComponent implements OnInit {
  @Input() place: Place;
  @Input() id: number;

  constructor(
    private modalCtrl: ModalController,
    private homeService: HomeService,
    // private homePage: HomePage
  ) { }

  ngOnInit() {}

  onCloseModal() {
    this.modalCtrl.dismiss();
  }

  onDelete() {
    this.homeService.removePlace(this.id);
    // this.homePage.onDeletePlace(this.id);
    this.onCloseModal();
  }
}
