import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import icSearch from '@iconify/icons-ic/twotone-search';
import icPdf from '@iconify/icons-ic/picture-as-pdf';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'vex-subtareas',
  templateUrl: './subtareas.component.html',
  styleUrls: ['./subtareas.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class SubtareasComponent implements OnInit {

  icPdf = icPdf;

  @Input() subTareas?: any[] = [];
  @Input() ticket?: any;

  icSearch = icSearch;
  tipoTarea: any;

  constructor(private router: Router,
    private data: DataService,
    ) { }

  ngOnInit(): void {
    this.data.getTiposTareasByArea(this.ticket.idDepartamento).subscribe((tiposTareas: any) => {
      const data = tiposTareas["result"].filter(tarea => tarea.idTipoTarea == this.ticket.idTipoTarea)
      this.tipoTarea = data[0];
    })
  }

  verSubTarea(idSubTarea) {
    this.router.navigateByUrl(`/tickets/detalle-ticket/${idSubTarea}`);
  }

}
