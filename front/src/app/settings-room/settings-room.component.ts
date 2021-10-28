import { Room } from './../../../libs/room';
import { PlaylistService } from './../_services/playlist_service';
import { RoomService } from './../_services/room_service';
import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Playlist } from 'libs/playlist';
import { FormControl } from '@angular/forms';
import * as $ from 'jquery';
import { WebsocketService } from '../_services/websocketService';

declare var google: any;

@Component({
  selector: 'app-settings-room',
  template: `
    <div class="item-container">
      <div class="item-name">Public / Private</div>
      <ion-toggle
        *ngIf="this.type === 'room'"
        [(ngModel)]="this.toggle"
        [checked]="this.room.type === 'private'"
        (click)="this.changeType($event)"
      ></ion-toggle>
      <ion-toggle
        *ngIf="this.type === 'playlist'"
        [(ngModel)]="this.toggle"
        [checked]="this.playlist.type === 'private'"
        (click)="this.changeType($event)"
      ></ion-toggle>
    </div>
    <div>
      <p>Plage horaire de la room:</p>
      <ion-item>
        <ion-label>début</ion-label>
        <ion-datetime
          name="start"
          display-format="HH:mm"
          minute-values="0,15,30,45"
          [(ngModel)]="this.form.start"
        >
        </ion-datetime>
      </ion-item>
      <ion-item>
        <ion-label>fin</ion-label>
        <ion-datetime
          name="end"
          display-format="HH:mm"
          minute-values="0,15,30,45"
          [(ngModel)]="this.form.end"
        >
        </ion-datetime>
      </ion-item>
      <p>Créez une zone pour délimiter votre room:</p>
      <form
        name="form"
        (ngSubmit)="f.form.valid && SubmitCirc()"
        #f="ngForm"
        novalidate
      >
        <div class="form-group">
          <div class="mb-3">
            <label for="radiusCirc" class="form-label">Radius (meters)</label>
            <input
              name="radiusCirc"
              type="text"
              class="form-control"
              id="radiusCirc"
              placeholder="Enter the radius"
              [(ngModel)]="this.form.radius"
              required
              #radiusPoly="ngModel"
            />
          </div>
          <div class="mb-3">
            <label for="pac-input3" class="form-label">Location</label>
            <div>
              <input
                #searchCirc
                class="form-control"
                id="pac-input3"
                type="text"
                placeholder="Enter a location"
              />
            </div>
          </div>
        </div>
        <div style="color: red;">
          <p *ngIf="errorCirc.radius !== ' ' || errorCirc.location !== ' '">
            {{ errorCirc.radius }} {{ errorCirc.location }}is missing to create
            a circle
          </p>
        </div>
        <ion-button type="submit" class="btn btn-primary">Create</ion-button>
      </form>
      <div>
        <div #mapContainer id="map"></div>
        <div id="mapError"></div>
      </div>
      <ion-button (click)="submitForm()" [disabled]="!formReady" expand="block"
        >sauvegarder</ion-button
      >
    </div>
  `,
  styleUrls: ['./settings-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsRoomComponent implements OnInit {
  @Input() public userId: string;
  @Input() public room?: Room;
  @Input() public playlist?: Playlist;
  @Input() public type: 'room' | 'playlist';

  @ViewChild('mapContainer', { static: false }) public gmap: ElementRef;
  @ViewChild('searchCirc') public searchCirc: ElementRef;

  public map: google.maps.Map;
  coordinates = new google.maps.LatLng(47.128439, 2.779515);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 5.5,
  };

  public formReady = false;
  public form: any = {
    radius: 0,
    start: '00:00',
    end: '23:59',
  };
  public errorCirc = {
    radius: ' ',
    location: ' ',
  };
  public locationCirc: object;
  public circles: any[] = [];
  public circlesData: object;

  public toggle = false;
  public test = false;

  constructor(
    private popoverCtrl: PopoverController,
    private cd: ChangeDetectorRef,
    private socketService: WebsocketService,
    private roomService: RoomService
  ) {
    this.socketService
      .listenToServer('room update ' + this.room?._id)
      .subscribe((data) => {
        if (data.status === false) this.toggle = !this.toggle;
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer('playlist update ' + this.playlist?._id)
      .subscribe((data) => {
        if (data.status === false) this.toggle = !this.toggle;
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer('room update limits')
      .subscribe((data) => {
        console.log(data);
      });
  }

  ngOnInit(): void {
    if (this.type === 'room') {
      this.toggle = this.room.type === 'private' ? true : false;
    } else if (this.type === 'playlist') {
      this.toggle = this.playlist.type === 'private' ? true : false;
    }
    this.cd.detectChanges();
    this.mapInitializer();
    $('#pac-input3').on('input', function (e) {
      $('.pac-container').append(`<style>.pac-container {
        z-index: 10000 !important;
    }</style>`);
    });
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    const autocomplete3 = new google.maps.places.Autocomplete(
      this.searchCirc.nativeElement
    );
    autocomplete3.addListener('place_changed', () => {
      const place: google.maps.places.PlaceResult = autocomplete3.getPlace();
      this.locationCirc = {
        lat: place.geometry?.location.lat(),
        lng: place.geometry?.location.lng(),
      };
    });
  }

  async SubmitCirc() {
    if (this.form.radius === undefined) this.errorCirc.radius = 'radius';
    else this.errorCirc.radius = ' ';
    if (this.locationCirc === undefined) this.errorCirc.location = 'location';
    else this.errorCirc.location = ' ';
    if (this.form.radius !== undefined && this.locationCirc !== undefined)
      await this.pushCirc(this.locationCirc, this.form.radius);
  }

  pushCirc(location: any, radius: string) {
    return new Promise((resolve) => {
      this.clear();
      var lng = location.lng;
      var lat = location.lat;
      var coordonnes = { lat: lat, lng: lng };

      let circle = new google.maps.Circle({
        center: coordonnes,
        radius: parseInt(radius),
        editable: false,
        strokeColor: '#000000',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: '#000000',
        fillOpacity: 0.45,
      });
      circle.setMap(this.map);
      this.circlesData = {
        radius: circle.radius,
        center: {
          latitude: circle.center.lat(),
          longitude: circle.center.lng(),
        },
      };
      this.circles.push(circle);
      this.formReady = true;
      return resolve(1);
    });
  }

  clear() {
    this.circles.map(function (circ) {
      if (circ.getMap() != null) circ.setMap(null);
    });
    this.circlesData = [];
  }

  submitForm() {
    console.log(this.form, this.circlesData);
    this.roomService.addGeoAndHoursLimit(
      this.form,
      this.circlesData,
      this.room._id,
      this.userId
    );
  }

  changeType(event: any) {
    if (this.type === 'room') {
      this.socketService.emitToServer('room change type', {
        userId: this.userId,
        roomId: this.room?._id,
        type: !this.toggle ? 'private' : 'public',
      });
    } else if (this.type === 'playlist') {
      this.socketService.emitToServer('playlist change type', {
        userId: this.userId,
        playlistId: this.playlist?._id,
        type: !this.toggle ? 'private' : 'public',
      });
    }
    // this.cd.detectChanges();
  }

  close() {
    this.popoverCtrl.dismiss();
  }
}
