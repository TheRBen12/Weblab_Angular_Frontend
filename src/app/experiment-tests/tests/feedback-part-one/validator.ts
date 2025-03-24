import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const dateOrderValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const arrival = group.get('arrival')?.value;
  const departure = group.get('departure')?.value;

  if (!arrival || !departure) return null;

  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);

  return arrivalDate < departureDate ? null : { dateOrderInvalid: true };
};
