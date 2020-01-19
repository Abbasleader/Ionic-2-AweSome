import { MapLocation } from './map-location.model';

export class Place {
    constructor(
        public title: string,
        public description: string,
        public location: MapLocation,
        public imagePath: string
    ) { }
}
