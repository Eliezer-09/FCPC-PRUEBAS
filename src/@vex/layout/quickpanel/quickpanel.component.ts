import { Component, OnInit, ChangeDetectorRef, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { environment } from 'src/environments/environment';
import { TicketsService } from '../../../app/pages/tickets/tickets.service';
import { DataService } from '../../../app/services/data.service';

import icInbox from '@iconify/icons-ic/inbox';
import icSend from '@iconify/icons-ic/send';
import icMencion from '@iconify/icons-ic/mode-comment';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'vex-quickpanel',
  templateUrl: './quickpanel.component.html',
  styleUrls: ['./quickpanel.component.scss'],
})
export class QuickpanelComponent implements OnInit {

  date = DateTime.local().toFormat('DD');
  dayName = DateTime.local().toFormat('EEBEE');
  countNotificaciones = 0;
  notificaciones;
  ticketsAsignado = [];
  idEntidad = "";
  count = 0;
  statusColor;

  icSend = icSend;
  icInbox = icInbox;
  icMencion = icMencion;

  change: EventEmitter<number> = new EventEmitter<number>();

  @Input() ticketsGenerados: [] = []
  @Input() ticketsSolicitados: [] = [] 
  @Input() ticketsMencionados: [] = [] 

  constructor(
    private ticketService: TicketsService,
    private changeDetector: ChangeDetectorRef,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
   
  }


  showTicketInfo(objTicket) {
    this.ticketService.AClicked(objTicket.idTicket);
    this.router.navigate([`/tickets/detalle-ticket/${objTicket.idTicket}`], { queryParamsHandling: objTicket.idTicket });
  }

  getStatusColor(status){
    return this.ticketService.setStatusColor(status);
  }

}