import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import icClose from '@iconify/icons-ic/close';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Casa, Emisor, Calificadora } from 'src/app/model/models';
import { Miembros } from '../../../ticket.interface';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'vex-asignar-miembro',
  templateUrl: './asignar-miembro.component.html',
  styleUrls: ['./asignar-miembro.component.scss']
})
export class AsignarMiembroComponent implements OnInit, AfterViewChecked {

  //Variables
  empleados: any[] = [];
  public filteredMiembros: ReplaySubject<Miembros[]> = new ReplaySubject<Miembros[]>(1);
  public miembroFilterCtrl: FormControl = new FormControl();
  icClose = icClose;
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  // Form Group
  formGenerales = this.fb.group({
    idEmpleado: [""],
  });

  constructor(
    private fb: FormBuilder,
    private _dialogRef: MatDialogRef<AsignarMiembroComponent>,
    private changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data:Miembros[]
  ) { }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.empleados = this.data;
    this.filteredMiembros.next(this.data.slice());
      // listen for search field value changes
      this.miembroFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filter();
        });
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
   protected setInitialValue() {

    this.filteredMiembros
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Miembros, b: Miembros) => a && b && a.idEmpleado === b.idEmpleado;
      });

  }

  protected filter() {
    if (!this.empleados) {
      return;
    }
    // get the search keyword
    let search = this.miembroFilterCtrl.value;
    if (!search) {
      this.filteredMiembros.next(this.empleados.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the emisor
    const data = this.empleados.filter(miembro => miembro.nombre.toLowerCase().indexOf(search) > -1)
    this.filteredMiembros.next(
      this.empleados.filter(miembro => miembro.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

  cerrarModal(colaborador): void {
    this._dialogRef.close(colaborador);
  }

  cerrar(): void {
    this._dialogRef.close();
  }


}
