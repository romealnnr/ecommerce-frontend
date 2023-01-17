import { FormControl, NumberValueAccessor, ValidationErrors } from "@angular/forms";

export class NnrShopValidators {

    //white space validator
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

        //check if string only have whitespace
        if((control.value != null) && (control.value.trim().length == 0)){
            //invalid, return object
            return {'notOnlyWhiteSpace' : true};
        }else{
            return null as any;
        }

       
    }
}
