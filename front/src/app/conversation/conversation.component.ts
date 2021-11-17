import { User } from 'libs/user';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../_services/message_service';
import { WebsocketService } from '../_services/websocketService';
import { Location } from '@angular/common';
import { AuthService } from '../_services/auth_service';

@Component({
  selector: 'app-conversation',
  template: `
    <img
      class="back-img"
      (click)="this.back()"
      src="./assets/chevron-back-outline.svg"
    />
    <div *ngIf="this.conv" class="conv-container">
      <p class="title">{{ conv.name }}</p>
      <div class="messages">
        <div
          [class.me]="this.user?.id === msg.userId"
          class="message-container"
          *ngFor="let msg of this.conv.messages"
        >
          <div [class.me]="this.user?.id === msg.userId" class="message-bulb">
            {{ msg.message }}
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <input class="search-container" #input />
      <img
        class="img-send"
        (click)="sendMessage()"
        src="./assets/send-white.svg"
      />
    </div>
  `,
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild('input', { static: false }) input: ElementRef;

  public convId: string = this.route.snapshot.params.id;

  constructor(
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private socketService: WebsocketService,
    private location: Location,
    private authService: AuthService
  ) {
    this.socketService
      .listenToServer(`chat message ${this.convId}`)
      .subscribe((data) => {
        console.log(data);
        if (JSON.stringify(this.conv) !== JSON.stringify(data)) {
          this.conv = data;
        }
        this.cd.detectChanges();
      });
  }

  public conv = null;

  public user: User;

  ngOnInit() {
    this.user = this.authService.getUser();
    console.log(this.convId);
    this.messageService
      .getConvDetail(this.user.id, this.convId)
      .subscribe((res) => {
        console.log(res);
        this.conv = res.conversation;
        this.cd.detectChanges();
      });
  }

  public back() {
    this.location.historyGo(-1);
  }

  sendMessage() {
    if (this.input.nativeElement.value) {
      this.socketService.emitToServer('chat message', {
        userId: this.user.id,
        convId: this.convId,
        message: this.input.nativeElement.value,
      });
    }
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
