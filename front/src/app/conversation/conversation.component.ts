import { User } from 'libs/user';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
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
    <div *ngIf="this.conv">
      <p class="title">{{ conv.name }}</p>
      <div class="conv-container">
        <div class="message-container" *ngFor="let msg of this.conv.messages">
          {{ msg.message }}
        </div>
      </div>
    </div>
    <p (click)="sendMessage()">Send message</p>
  `,
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit, OnDestroy {
  public convId: string = this.route.snapshot.params.convId;

  constructor(
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private socketService: WebsocketService,
    private location: Location,
    private authService: AuthService
  ) {
    this.socketService.setupSocketConnection();
    this.socketService
      .listenToServer(`chat message ${this.convId}`)
      .subscribe((data) => {
        console.log(data);
        if (this.conv) {
          this.conv.messages.push({ message: data });
        } else {
          this.conv.messages = { message: data };
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
        this.conv = res.conversation[0];
        this.cd.detectChanges();
      });
  }

  public back() {
    this.location.historyGo(-1);
  }

  sendMessage() {
    this.socketService.emitToServer('chat message', {
      userId: this.user.id,
      convId: this.convId,
      message: 'testIonicV2',
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
