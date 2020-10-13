import { Dependent } from './dependent';

export class Employee {
  id: number = NaN;
  firstName: string = null;
  lastName: string = null;
  dateHired: Date = null;
  biWeeklyPay: number = NaN;
  dependents: Dependent[] = null;
}
