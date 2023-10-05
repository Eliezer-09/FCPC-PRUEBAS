import { Component, OnInit, Input } from '@angular/core';
import { Icon } from '@visurel/iconify-angular';
import faCaretUp from '@iconify/icons-fa-solid/caret-up';
import faCaretDown from '@iconify/icons-fa-solid/caret-down';
import icHelp from '@iconify/icons-ic/help-outline';
import icShare from '@iconify/icons-ic/twotone-share';
import { scaleInOutAnimation } from 'src/@vex/animations/scale-in-out.animation';
import { fadeInUp400ms } from '../../../../../../@vex/animations/fade-in-up.animation';
import { stagger80ms } from '../../../../../../@vex/animations/stagger.animation';
import { ParticipesService } from '../../../participes.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'vex-valores',
  templateUrl: './valores.component.html',
  styleUrls: ['./valores.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ValoresComponent implements OnInit {

  @Input() icon: Icon;
  @Input() value: string;
  @Input() label: string;
  @Input() change: number;
  @Input() helpText: string;
  @Input() iconClass: string;
  @Input() detalles: any[];
  @Input() segmento: any;
  @Input() valueLabel: string;

  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  icHelp = icHelp;
  icShare = icShare;
  aportesVencido: any[] = [
    {
      nombre: 'Creditos',
    },
    {
      nombre: 'Aportes',
    },
  ]

  aportesPendientes = [];

  showButton: boolean;
  showFrontCard = false;

  constructor(
    private logger: NGXLogger,
    private apiParticipe: ParticipesService
  ) { }

  ngOnInit() {

  }

  mostrarDetallesCard(event) {
    this.showFrontCard = event;
  }

}