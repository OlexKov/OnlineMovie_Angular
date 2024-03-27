import { FormGroup } from "@angular/forms";

export  class FormValidators
{
   static validate(formGroup:FormGroup,controlName:string,displayName:string):string
   {
    var value = formGroup.controls[controlName];
   // if (value.touched && value.errors) {
      if (value.errors?.required) {
        return `${displayName} can't be empty`;
      } else if (value.errors?.minlength) {
        return `${displayName} must have min length ${value.errors?.minlength?.requiredLength} symbols. Now -
                ${value.value?.length} symbols`;
      } else if (value.errors?.maxlength) {
        return `${displayName} must have max length ${value.errors?.maxlength?.requiredLength} symbols. Now -
               ${value.value?.length} symbols`;
      } else if (value.errors?.pattern) {
        return `${displayName} must start with uppercase leter`;
      }else if (value.errors?.min) {
          return `Select ${displayName} (min ${value.errors?.min.min})`;}
   // }
    return '';
   }

   static isError(formGroup:FormGroup,controlName:string):boolean {
    return  formGroup.controls[controlName].errors != null;
  }
}
