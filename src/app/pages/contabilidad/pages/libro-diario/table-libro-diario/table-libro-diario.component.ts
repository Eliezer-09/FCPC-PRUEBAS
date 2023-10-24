import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { iconify } from "src/static-data/icons";
import { FormBuilder } from "@angular/forms";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { LocalService } from "src/app/services/local.service";
@Component({
  selector: "vex-table-libro-diario",
  templateUrl: "./table-libro-diario.component.html",
  styleUrls: ["./table-libro-diario.component.scss"],
  animations: [stagger80ms, fadeInRight400ms],
})
export class TableLibroDiarioComponent {
  icroundAutoStories = iconify.icroundAutoStories;
  layoutCtrl = new FormControl("boxed");
  icroundLabel = iconify.icroundLabel;
  activeCategory;
  menuOpen = false;
  activeItem = {
    emisor: true,
    calificadora: false,
    custodio: false,
    casa: false,
  };
  items = [
    {
      id: 0,
      icon: this.icroundLabel,
      label: "Borrador",
    },
    {
      id: 1,
      icon: this.icroundLabel,
      label: "Cerrado",
    },
  ];
  constructor(private fb: FormBuilder, private localServiceS: LocalService) {}

  ngOnInit() {
    this.activeCategory=JSON.parse(sessionStorage.getItem('activeCategory')) || 0
    if(this.activeCategory>this.items.length) this.activeCategory=0;
    this.filterChange(this.activeCategory)
  }

  filterChange(category) {
    Object.entries(this.activeItem).forEach((control) => {
      const [key, value] = control;
      this.activeItem[key] = false;
    });
    this.activeItem[category]=true;
    sessionStorage.setItem('activeCategory', JSON.stringify(category))
  }
}
