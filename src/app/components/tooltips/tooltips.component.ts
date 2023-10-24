import { Component, Input, OnInit } from '@angular/core';
import { TooltipComponent }         from "@angular/material/tooltip";


Object.defineProperty(TooltipComponent.prototype, 'message', {
  set(message: any) {
      const compoment = document.querySelectorAll('.mat-tooltip');

      if (compoment) {
        compoment[compoment.length - 1].innerHTML = message;
        if(message.length>250) compoment[compoment.length - 1].className+=" my-mat-tooltip";
      }
  },
});


@Component({
  selector: 'vex-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss']
})
export class TooltipsComponent implements OnInit {
  @Input() message:string="";
  @Input() tooltip_message:string;

  constructor() { }

  ngOnInit(): void {
    this.tooltip_message=`<div>${this.tooltip_message}</div>`
  }

}
