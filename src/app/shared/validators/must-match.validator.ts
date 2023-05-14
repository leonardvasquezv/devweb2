import { FormGroup } from "@angular/forms";

/**
 * Metodo que indica si dos inputs coinciden
 * @param controlName, nombre del input
 * @param matchingControlName, nombre del input a ser comparado
 * @returns 
 */
export function MustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}
