import { async } from '@angular/core/testing';
import { map } from 'rxjs/operators';
import { Room } from './../../../libs/room';
import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { RoomService } from '../_services/room_service';
import { SpotifyService } from '../_services/spotify_service';

@Component({
  selector: 'app-room',
  template: `
    <div class="room-container" *ngIf="this.room">
      <div class="title">
        {{ this.room.name }}
      </div>
      <div class="sub-title">Suggérer un titre</div>
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
export class RoomComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cd: ChangeDetectorRef,
    private spotifyService: SpotifyService
  ) {}

  public room: Room;
  public roomId: string = this.route.snapshot.paramMap.get('id');
  public tracks = [];

  ngOnInit(): void {
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
}
