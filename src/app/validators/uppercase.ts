import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasUppercase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { hasUppercase: true };
  };
}

export function hasNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasNumber = /[0-9]/.test(control.value);
    return hasNumber ? null : { hasNumber: true };
  };
}

export function matchPassword(
  controlName: string,
  checkControlName: string
): ValidatorFn {
  return (controls: AbstractControl) => {
    const control = controls.get(controlName);
    const checkControl = controls.get(checkControlName);

    if (checkControl?.errors && !checkControl.errors['matching']) {
      return null;
    }

    if (control?.value !== checkControl?.value) {
      controls.get(checkControlName)?.setErrors({ matching: true });
      return { matching: true };
    } else {
      return null;
    }
  };
}
