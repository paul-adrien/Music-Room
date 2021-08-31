import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../_services/message_service';
import { WebsocketService } from '../_services/websocketService';

@Component({
  selector: 'app-messages',
  template: `
  <button (click)="createConv()">Créer une conversation</button>
  <div *ngIf="this.convList">
    <div *ngFor="let conv of this.convList.conversations">
      <p (click)="conversation(conv._id)">{{ conv.name }}</p>
    </div>
  </div>
  `,
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {

  public convList = null;
  private users = [{
    name: "u1",
    userId: "60b7dc84c32e29ce6919e2a6"
  },
  {
    name: "u2",
    userId: "60c1e2e36aad9926448caef2"
  }];

  constructor(private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {
    this.messageService.getConvList('60b7dc84c32e29ce6919e2a6').subscribe((res) => {
      console.log(res);
      this.convList = res;
      this.cd.detectChanges();
    })
  }

  createConv() {
    this.messageService.createConv('60b7dc84c32e29ce6919e2a6', 'ionicTest2', this.users).subscribe((res) => {
      console.log(res);
    });
    this.messageService.getConvList('60b7dc84c32e29ce6919e2a6').subscribe((res) => {
      console.log(res);
      this.convList = res;
      this.cd.detectChanges();
    })
  }

  conversation(id: string) {
    this.router.navigate(["conversation/" + id]);
  }

}
