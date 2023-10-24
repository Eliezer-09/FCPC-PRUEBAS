import {
  Component,
  OnInit,
} from "@angular/core";
import { TiposAdjunto } from "src/@vex/interfaces/enums";
import { PostAdjunto} from "src/app/model/models";
import { DataService } from "../../../../../../app/services/data.service";
import { UtilsService } from '../../../utils/utils.service';
import icDocument from "@iconify/icons-ic/attach-file";
import vacationIcon from '@iconify/icons-fluent-mdl2/vacation';
import {
  FormControl, FormGroup
} from "@angular/forms";
import { Calendar } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth'
import esLocale from '@fullcalendar/core/locales/es';
import tippy from 'tippy.js';
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { DetalleVacacionesComponent } from "./detalle-vacaciones/detalle-vacaciones.component";

@Component({
  selector: 'vex-peticion-vacaciones',
  templateUrl: './peticion-vacaciones.component.html',
  styleUrls: ['./peticion-vacaciones.component.scss'],
})
export class PeticionVacacionesComponent implements OnInit {
  minDate: Date = new Date();
  datePipe: DatePipe;
  archivoCargado: File;
  calendar: Calendar;
  form: FormGroup;
  icDocument = icDocument;
  rutaHeader: "/vacaciones";
  icono = vacationIcon;
  tituloHeader = "Vacaciones";
  nombreArchivo: string;
  tamanioArchivo: number;
  fileBase64: string;
  mostrarAdjuntos = false;
  existeSubTarea = false;
  participe = false;
  nombreParticipe;
  adjunto;
  adjuntos: PostAdjunto[] = [];
  tipo: string[] = ['Vacaciones', 'Enfermedad', 'Maternidad', 'Otro'];
  layoutCtrl = new FormControl('boxed');
  controlScreen = "Solicitud de vacaciones";
  constructor(private utilService: UtilsService, private dataServices: DataService, public dialog: MatDialog,) {
    this.form = new FormGroup({
      tipo: new FormControl(),
      start: new FormControl(),
      end: new FormControl(),
    });
  }
  ngOnInit() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new Calendar(calendarEl, {
      events: [
        {
          title: 'RECHAZADAS',
          start: '2023-12-01',
          end:'2023-12-11',
          display: 'background',
          color: 'red',
          extendedProps: {
            description: 'Poco personal activo'
          }
        },
        {
          title: 'PENDIENTES',
          start: '2023-01-05',
          end: '2023-01-12',
          display: 'background',
          color: 'orange',
          extendedProps: {
            description: 'Pendiente aprobación'
          }
        },
        {
          title: 'APROBADAS',
          start: '2023-08-05',
          end: '2023-08-12',
          display: 'background',
          color: 'green',
        },
      ],
      
      eventDidMount: function (info) {
      tippy(info.el, {
        content: info.event.extendedProps.description,
        placement: 'top',
        trigger: 'mouseenter',
      });
    },

      buttonText: {
        prevYear: '<', 
        nextYear: '>', 
      },
      
      locale: esLocale,
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      height:'auto',
      aspectRatio: 5,
      plugins: [multiMonthPlugin],
      initialView: 'multiMonthYear',
      
      views: {
        multiMonthYear: {
          themeSystem:'standard',
          weekday: 'short', 
          month: 'numeric', 
          day: 'numeric', 
          omitCommas: true,
          multiMonthMaxColumns: 6,
          
        }
      }
      
    })
    calendar.render();
  }
  enviarFormulario(): void {
    if (this.form.valid) {
      this.utilService.alerta('success', 'Petición ingresada correctamente');
      this.form.reset();
    } else {
      this.utilService.alerta('error', 'Por favor complete todos los campos obligatorios');
    }
  }


  borrarFormulario(): void {
    this.form.reset();
  }
  
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file.type === 'application/pdf') {
        this.archivoCargado = file;
        this.nombreArchivo = file.name;
        this.tamanioArchivo = file.size;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.fileBase64 = reader.result as string;
            this.adjunto = true;
            this.mostrarAdjuntos = true;
            const data: PostAdjunto = {
                tipoAdjunto: TiposAdjunto.Documento,
                adjunto: this.fileBase64,
                mimeType: file.type,
                size: file.size,
                name: file.name,
                observaciones: file.name,
            };
  
            this.adjuntos.push(data);
        };
    } else {
      this.utilService.alerta('error', 'Solo se admiten PDF');
    }
  }
  eliminarArchivoCargado(): void {
    this.archivoCargado = null;
    this.nombreArchivo = null;
    this.tamanioArchivo = null;
    this.fileBase64 = null;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DetalleVacacionesComponent, {

    });
  }

}


