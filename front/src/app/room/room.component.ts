import { SearchComponent } from './../search/search.component';
import { async } from '@angular/core/testing';
import { map } from 'rxjs/operators';
import { Room } from './../../../libs/room';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { RoomService } from '../_services/room_service';
import { SpotifyService } from '../_services/spotify_service';
import { User } from 'libs/user';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../_services/auth_service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room',
  template: `
    <ion-icon
      (click)="this.quitRoom()"
      class="back-img"
      name="chevron-back-outline"
    ></ion-icon>
    <div class="room-container" *ngIf="this.room">
      <div class="title">
        {{ this.room.name }}
      </div>
      <div class="primary-button suggestion" (click)="this.presentModal()">
        Suggérer un titre
      </div>
      <div></div>
      <div class="sub-title">Prochains titres</div>
      <div class="tracks-container" *ngFor="let track of this.tracks">
        <img class="logo" [src]="track.album.images[0].url" />
        <div class="track-info">
          <div class="info-top">{{ track.name }}</div>
          <div class="info-bottom">{{ track.artists[0].name }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cd: ChangeDetectorRef,
    private spotifyService: SpotifyService,
    private location: Location,
    private authService: AuthService,
    public modalController: ModalController
  ) {}

  public room: Room;
  public user: User;
  public roomId: string = this.route.snapshot.paramMap.get('id');
  public tracks = [];

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.roomService.getRoom(this.roomId).subscribe((res) => {
      this.room = res.room;
      this.getTracksInfo(this.room.musics);
      this.cd.detectChanges();
    });
  }

  getTracksInfo(musics: any) {
    this.spotifyService
      .getTracksInfo(musics.map((music) => music.trackId))
      .pipe(map((res: any) => res.tracks))
      .subscribe((res) => {
        this.tracks = res;
        this.cd.detectChanges();
      });
  }

  quitRoom() {
    this.roomService.quitRoom(this.user.id, this.roomId).subscribe((res) => {
      if (res.status) {
        this.location.back();
        //this.navCtrl.navigateBack('/tabs/home');
      }
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        isModal: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.track) {
        const track = res.data.track;
        console.log(track);
        this.roomService.addTrack(track.id, this.roomId).subscribe((res) => {
          this.ngOnInit();
          this.cd.detectChanges();
        });
      }
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.quitRoom();
  }
}
