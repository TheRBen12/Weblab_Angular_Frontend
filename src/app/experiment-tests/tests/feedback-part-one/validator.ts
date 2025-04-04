import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const dateOrderValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const arrival = group.get('arrival')?.value;
  const departure = group.get('departure')?.value;

  if (!arrival || !departure) return null;

  const now = new Date();
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);

  if (arrivalDate > departureDate){
    return { dateOrderInvalid: true };
  }
  if (arrivalDate < now){
    return { arrivalDateOrderInvalid: true };
  }
  return null;

};
