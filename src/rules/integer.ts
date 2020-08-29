import { ValidationRuleModifiers } from "../decorators";
import { capitalize } from "lodash";

const ANumber = (modifiers:ValidationRuleModifiers) => ({
  modifiers,
  valid: (input) => !isNaN(input),
  reject: (input, label) => `${capitalize(label)} must be a number`
});
  
const GreaterThan = (number:Number) => (modifiers:ValidationRuleModifiers) => ({
  modifiers,
  valid: (input) => input > number,
  reject: (input, label) => `${capitalize(label)} must be greater than ${number}`
});

export const Integer = {
  ANumber, GreaterThan
}