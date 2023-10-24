import { Injectable } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ValidatorsService {
  public nombreApellidoPattern: string = "([a-zA-Z]+) ([a-zA-Z]+)";
  public soloLetrasVocalesPattern: string = "^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$";
  public soloNumerosPattern: string = "^[0-9]*$";

  constructor() {}

  public isValidField(formGroup: FormGroup, field: string) {
    return (
      formGroup.controls[field].errors && formGroup.controls[field].touched
    );
  }

  public fechaNacimientoValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const fechaNacimiento = control.value;
    if (fechaNacimiento) {
      const fechaLimite = new Date();
      fechaLimite.setFullYear(fechaLimite.getFullYear() - 15);

      if (fechaNacimiento > fechaLimite) {
        return { fechaNacimientoInvalida: true };
      }
    }

    return null;
  }

  public emailFormatValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (control.value && !emailRegex.test(control.value)) {
      return { invalidEmailFormat: true };
    }

    return null;
  }

  public getFieldErrorMessage(
    formGroup: FormGroup,
    field: string
  ): string | null {
    if (!formGroup.controls[field]) return null;
    const errors = formGroup.controls[field].errors || {};
    const customErrors = formGroup.controls[field].asyncValidator || {};

    const allErrors = { ...errors, ...customErrors };

    for (const key of Object.keys(allErrors)) {
      switch (key) {
        case "required":
          return "El campo es requerido";
        case "pattern":
          return "El campo no es válido";
        case "minlength":
          return (
            "El campo debe tener al menos " +
            errors[key].requiredLength +
            " caracteres"
          );
        case "maxlength":
          return (
            "El campo debe tener como máximo " +
            errors[key].requiredLength +
            " caracteres"
          );
        case "min":
          return "El campo debe tener un valor mínimo de " + errors[key].min;
        case "max":
          return "El campo debe tener un valor máximo de " + errors[key].max;
        case "email":
          return "El campo debe ser un email válido";
        case "noValid":
          return "El campo no es válido";
        case "invalidEmailFormat":
          return "El campo no es un email válido";
        case "fechaNacimientoInvalida":
          return "La fecha de nacimiento no puede ser mayor a 15 años";

        case "incorrect":
          return "El campo no es correcto";

        default:
          return "Error en el campo";
      }
    }
    return null;
  }
}
