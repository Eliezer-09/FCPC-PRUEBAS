import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CambiarClaveComponent } from "./cambiar-clave/cambiar-clave.component";
import { LoginComponent } from "./login/login.component";
import { AngularMaterialModule } from "../angular-material.module";
import { PerfilComponent } from "./perfil/perfil.component";
import { InfoPerfilComponent } from "./perfil/info-perfil/info-perfil.component";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
    CambiarClaveComponent,
    LoginComponent,
    PerfilComponent,
    InfoPerfilComponent,
  ],
  imports: [CommonModule, AngularMaterialModule, AuthRoutingModule],
  exports: [
    PerfilComponent,
    CambiarClaveComponent,
    LoginComponent,
    InfoPerfilComponent,
  ],
})
export class AuthModule {}
