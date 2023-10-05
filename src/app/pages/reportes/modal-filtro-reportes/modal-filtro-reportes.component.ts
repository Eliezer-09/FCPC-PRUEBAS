import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl, FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { formatDate } from "@angular/common";
import { ReporteDTOLight, ParametrosReporte } from "../../../model/models";
import { iconify, iconfa } from "src/static-data/icons";
import { default as _rollupMoment, Moment } from "moment";

@Component({
  selector: "vex-modal-filtro-reportes",
  templateUrl: "./modal-filtro-reportes.component.html",
  styleUrls: ["./modal-filtro-reportes.component.scss"],
})
export class ModalFiltroReportesComponent implements OnInit {
  selectCtrl: FormControl = new FormControl();
  report: ReporteDTOLight;
  icroundClose = iconify.icroundClose;
  iconModal = iconfa.faFileInvoice;
  filterform = this.fb.group({});
  formatControl = this.fb.control(null);
  mes: number;
  anio: number;
  isEstructura = false;
  isReporte = false;
  invalidfilterformdate = true;
  parameters: ParametrosReporte[] = [
    {
      descripcion: "",
      nombre: "",
      orden: 1,
      requerido: true,
      tipo: "text",
    },
  ];

  formatOptions_reporte = [
    {
      value: "PDF",
      opcion: "PDF",
    },
    {
      value: "Excel",
      opcion: "Excel",
    },
    {
      value: "Word",
      opcion: "Word",
    },
  ];

  formatOptions_estructura = [
    {
      value: "Excel",
      opcion: "Excel",
    },
    {
      value: "XML",
      opcion: "XML",
    },
    {
      value: "TXT",
      opcion: "TXT",
    },
  ];

  constructor(
    private dialogRef: MatDialogRef<ModalFiltroReportesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReporteDTOLight,
    private fb: FormBuilder
  ) {
    this.report = data;
    this.parameters = this.report["parametros"];
    this.typeReports(this.report);
    this.buildControls();
  }

  ngOnInit(): void {}

  typeReports(report) {
    this.isEstructura =
      report.periodicidad === "M" ||
      report.periodicidad === "A" ||
      report.periodicidad === "S" ||
      report.periodicidad === "E";
    this.isReporte =
      report.periodicidad === "R" ;
  }

  buildControls() {
    let controls = {};
    if (this.isReporte) {
      for (let control of this.parameters) {
        controls[control.nombre] = null;
      }
    }
    this.filterform = this.fb.group(controls);
  }

  transformDataType(type: string) {
    type = type.toLowerCase();
    if (type === "varchar" || type === "char") {
      return "text";
    } else if (
      type === "date" ||
      type === "datetime" ||
      type === "smalldatetime"
    ) {
      return "date";
    }
    return "number";
  }

  save() {
    this.formatDate();
    const formData = this.filterform.value;
    const format = this.formatControl.value;
    const data = {
      idReporte: this.report.idReporte,
      code: this.report.codigo,
      titulo: this.report.titulo,
      format: format,
      formData: formData,
    };
    this.dialogRef.close(data);
  }

  formatDate() {
    this.parameters.forEach((element) => {
      if (element.tipo === "DATE") {
        this.addEvent(element.nombre, this.filterform.value[element.nombre]);
      }
    });
  }

  addEvent(parameter, event) {
    this.filterform.value[parameter] = formatDate(event, "yyyy/MM/dd", "en-US");
  }

  setMonthAndYear(event) {
    if (event) {
      this.filterform.value["date_month_year"] = formatDate(
        event,
        "yyyy/M",
        "en-US"
      );
      this.invalidfilterformdate = false;
    } else {
      this.invalidfilterformdate = true;
    }
  }

  setYear(event) {
    if (event) {
      this.filterform.value["date_year"] = formatDate(event, "yyyy", "en-US");
      this.invalidfilterformdate = false;
    } else {
      this.invalidfilterformdate = true;
    }
  }
}
