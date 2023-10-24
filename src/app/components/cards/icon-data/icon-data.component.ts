import { Component, Input, OnInit } from '@angular/core';
import { IconCard } from '../../models/models-component';
import { stagger60ms, stagger80ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';

@Component({
  selector: 'app-icon-data',
  templateUrl: './icon-data.component.html',
  styleUrls: ['./icon-data.component.scss'],
  animations: [
    stagger60ms,
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class IconDataComponent implements OnInit {

  @Input()items:IconCard[]
  constructor() { }

  ngOnInit(): void {
  }

}
