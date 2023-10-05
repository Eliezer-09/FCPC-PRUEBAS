import { Component, Input } from '@angular/core';

@Component({
  selector: 'vex-info-message',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss']
})
export class InfoMessageComponent{
  iconMessage: string='fa-info-circle';
  message: string='No se ha encontrado lo que busca';
  @Input() typeicon: string= 'faIcon';
  @Input('icon') set changeIcon(icon: string) {
      this.iconMessage = icon;
  }

  @Input('message') set changemessage(message: string) {
      this.message = message;
  }


  constructor() { }
}
