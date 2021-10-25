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
    private location: Location
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

  ngOnInit() {
    console.log(this.convId);
    this.messageService
      .getConvDetail('60b7dc84c32e29ce6919e2a6', this.convId)
      .subscribe((res) => {
        console.log(res);
        this.conv = res.conversation[0];
        this.cd.detectChanges();
      });
  }

  public back() {
    this.location.back();
  }

  sendMessage() {
    this.socketService.emitToServer('chat message', {
      userId: '60b7dc84c32e29ce6919e2a6',
      convId: this.convId,
      message: 'testIonicV2',
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
