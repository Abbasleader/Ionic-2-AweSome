import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { IonBackButton, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { HomeService } from '../home.service';
import { MapLocation } from '../../model/map-location.model';

declare var cordova: any;

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.page.html',
  styleUrls: ['./add-place.page.scss'],
})
export class AddPlacePage implements OnInit {
  @ViewChild('buttons', { static: false }) buttons: IonBackButton;
  image: any = null;
  public placeForm: FormGroup;

  constructor(
    private sqlite: SQLite,
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private camera: Camera,
    private router: Router,
    private file: File,
    private toastCtrl: ToastController
  ) {
    this.createForm();
  }

  createForm() {
    this.placeForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.buttons.text = 'برگشت';
  }

  // private getMapImage(lat: number, lng: number, zoom: number) {
  //   return this.homeService.latitude != null ?
  //     `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
  //   &markers=color:blue%7Clabel:S%7C${lat},${lng}
  //   &key=${environment.googleMapAPIKey}` : null;
  // }

  onSubmit() {
    this.homeService.addPlaces(
      this.placeForm.value.title,
      this.placeForm.value.description,
      new MapLocation(0, 0),
      this.image
    );

    this.placeForm.reset();
    this.router.navigate(['home']);
  }

  takeImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      const currentName = imageData.replace(/^.*[\\\/]/, '');
      const path = imageData.replace(/[^\/]*$/, '');
      this.file.moveFile(path, currentName, cordova.file.dataDirectory, currentName)
        .then((data: any) => {
          this.image = data.nativeURL;
          this.camera.cleanup();
          this.file.removeFile(path, currentName);
        })
        .catch(
          (err: any) => {
            this.image = '';
            this.showToast();
            this.camera.cleanup();
          }
        );
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // alert(imageData)
      console.log('Take Image Method: ', imageData);
      this.image = (window as any).Ionic.WebView.convertFileSrc(imageData);
    }, (err) => {
      this.showToast();
    });
  }

  onSetLocation() {
  }

  showToast() {
    this.toastCtrl.create({
      message: 'Could not save the image. Please try again',
      duration: 2500
    }).then(toastEl => {
      toastEl.present();
    });
  }
}
