import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../_services/message_service';
import { WebsocketService } from '../_services/websocketService';

@Component({
  selector: 'app-conversation',
  template: `
  <div *ngIf="this.conv">
    <p>{{conv.name}}</p>
    <p (click)="sendMessage()">Send message</p>
    <div *ngFor="let msg of this.conv.messages">
      {{msg.message}}
    </div>
  </div>
  `,
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit, OnDestroy {

  constructor(private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private socketService: WebsocketService) {
    this.socketService.setupSocketConnection();
    this.socketService.listenToServer('chat message').subscribe((data) => {
      console.log(data);
      if (this.conv) {
        this.conv.messages.push({ message: data });
      } else {
        this.conv.messages = { message: data };
      }
      this.cd.detectChanges();
    })
  }

  public convId: string = this.route.snapshot.params.convId;
  public conv = null;


  ngOnInit() {
    console.log(this.convId);
    this.messageService.getConvDetail('60b7dc84c32e29ce6919e2a6', this.convId).subscribe((res) => {
      console.log(res);
      this.conv = res.conversation[0];
      this.cd.detectChanges();
    })
  }

  sendMessage() {
    this.socketService.emitToServer('chat message', { userId: '60b7dc84c32e29ce6919e2a6', convId: this.convId, message: 'testIonicV2' });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

}
