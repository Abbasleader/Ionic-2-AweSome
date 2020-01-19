import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'add-place',
    loadChildren: () => import('./add-place/add-place.module').then( m => m.AddPlacePageModule)
  },
  {
    path: 'set-location',
    loadChildren: () => import('./set-location/set-location.module').then( m => m.SetLocationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
