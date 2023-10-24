import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { iconify } from "src/static-data/icons";
import { FormBuilder } from "@angular/forms";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { LocalService } from "src/app/services/local.service";
@Component({
  selector: "vex-catalogo-inversion",
  templateUrl: "./catalogo-inversion.component.html",
  styleUrls: ["./catalogo-inversion.component.scss"],
  animations: [stagger80ms, fadeInRight400ms],
})
export class CatalogoInversionComponent {
  layoutCtrl = new FormControl("boxed");
  icroundBook = iconify.icroundBook;
  icroundPerson = iconify.icroundPerson;
  icroundSpellcheck = iconify.icroundSpellcheck;
  icroundShield = iconify.icroundShield;
  icroundAccountBalance = iconify.icroundAccountBalance;
  activeCategory=0;
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
      icon: this.icroundPerson,
      label: "Emisores",
    },
    {
      id: 1,
      icon: this.icroundSpellcheck,
      label: "Calificadoras",
    },
    {
      id: 2,
      icon: this.icroundShield,
      label: "Custodios",
    },
    {
      id: 3,
      icon: this.icroundAccountBalance,
      label: "Casas de Valor",
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
