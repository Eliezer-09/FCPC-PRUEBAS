import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import icViewHeadline from '@iconify/icons-ic/twotone-view-headline';

import { Icon } from '@visurel/iconify-angular';

import icHistory from '@iconify/icons-ic/twotone-history';
import icStar from '@iconify/icons-ic/twotone-star';
import icLabel from '@iconify/icons-ic/twotone-label';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TicketsService } from '../../tickets.service';
// import { Ticket } from 'src/app/pages/models/tickets';
// import { TicketsService } from 'src/app/pages/service/tickets.service';
// import { ELEMENT_DATA } from 'src/datos-estaticos/aio-table-data';
// import { PeriodicElement } from '../../historial-tickets.component';


export interface TicketsTableMenuItem {
  type: 'link' | 'subheading';
  id?: number;
  icon?: Icon;
  label: string;
  hijos?: any;
  estadoPadre?: number,
  classes?: {
    icon?: string;
  };
}

@Component({
  selector: 'vex-ticket-table-menu',
  templateUrl: './ticket-table-menu.component.html',
  styleUrls: ['./ticket-table-menu.component.scss'],
  animations: [fadeInRight400ms, stagger40ms],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TicketTableMenuComponent implements OnInit {

  @Input() items: TicketsTableMenuItem[] = [
    // {
    //   type: 'link',
    //   id: -1,
    //   icon: icViewHeadline,
    //   label: 'Todos',
    // },

    {
      type: 'subheading',
      label: 'Estados',
    },
  ];
  @Input() datos: any
  estados: any[]
  datosMenu: any[] = []
  hijos: any[]
  @Output() filterChange = new EventEmitter<any>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: TicketsTableMenuItem['id'] = 1;
  activeItem: any = null;
  icPersonAdd = icPersonAdd;



  constructor(
    private apiTicket: TicketsService) { }

  ngOnInit() {

    this.apiTicket.getEstados().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.items.push({
          type: 'link',
          id: element.idEstadoTicket,
          icon: icLabel,
          label: element.descripcion,
          hijos: element.hijos,
          estadoPadre: element.estadoPadre,
          classes: {
            icon: element.color
          }
        });
      });
    })

  }

  setFilter(category) {

    this.activeItem = category;
    this.activeCategory = category.id || category.idEstadoTicket;
    var categoryName = category.label || category.descripcion;

    if (categoryName != null) {
      return this.filterChange.emit(categoryName);
    }
    else {
      return this.filterChange.emit("");
    }
  }

  isActive(category: TicketsTableMenuItem['id']) {
    return this.activeCategory == category;
  }

}
