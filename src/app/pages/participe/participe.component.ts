import { ConditionalExpr } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import icDescription from "@iconify/icons-ic/twotone-description";
import icPhone from "@iconify/icons-ic/phone";
import icStar from "@iconify/icons-ic/star";
import icStarBorder from "@iconify/icons-ic/star-border";
import icMail from "@iconify/icons-ic/mail";
import icChat from "@iconify/icons-ic/chat";
import icBusiness from "@iconify/icons-ic/business";
import icCard from "@iconify/icons-ic/credit-card";
import icPerson from "@iconify/icons-ic/person";
import icDate from "@iconify/icons-ic/date-range";
import { Participe } from "src/app/model/models";
import { ClassGetter } from "@angular/compiler/src/output/output_ast";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-participe",
  templateUrl: "./participe.component.html",
  styleUrls: ["./participe.component.scss"],
})
export class ParticipeComponent implements OnInit {
  contact;
  toggleStar;

  icPhone = icPhone;
  icStar = icStar;
  icStarBorder = icStarBorder;
  icMail = icMail;
  icChat = icChat;
  icBusiness = icBusiness;
  icCard = icCard;
  icPerson = icPerson;
  icDate = icDate;

  token: any = this.route.snapshot.paramMap.get("token");
  noImagen = "../../../assets/img/sinPerfil.jpg";
  imagenParticipe;
  participe: Participe;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    await this.dataService
      .getParticipeByToken(this.token)
      .subscribe((response: Participe) => {
        this.participe = response;
        this.dataService
          .newGetAdjuntoById(this.participe.idParticipe, TiposAdjunto.Foto)
          .subscribe(
            (res) => {
              this.imagenParticipe = res["result"][0]["url"];
            },
            (error) => {
              if (error["status"] == 404) {
                this.imagenParticipe = "";
              }
            }
          );
      });
  }
}
