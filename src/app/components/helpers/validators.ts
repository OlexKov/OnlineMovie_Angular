import { FormGroup } from "@angular/forms";

export  class CostomValidator
{
   constructor(private formGroup:FormGroup){}
   validate(controlName:string,displayName:string,displayMessage?:string):string
   {
    var value = this.formGroup.controls[controlName];
   // if (value.touched && value.errors) {
      if (value.errors?.required)
        return `${displayName} is required`;
      if (value.errors?.minlength)
        return `${displayName} must have min length ${value.errors?.minlength?.requiredLength} symbols. Now -
                ${value.value?.length} symbols`;
      if (value.errors?.maxlength)
        return `${displayName} must have max length ${value.errors?.maxlength?.requiredLength} symbols. Now -
               ${value.value?.length} symbols`;
      if (value.errors?.pattern || value.errors?.confirmedValidator)
        return `${displayName} ${displayMessage}`;
      if (value.errors?.min)
          return `Select ${displayName} (min ${value.errors?.min.min})`
      if (value.errors?.email)
          return `Invalid ${displayName}`

   // }
    return '';
   }

    isError(controlName:string):boolean {
      return  this.formGroup.controls[controlName].errors != null;
  }
}
