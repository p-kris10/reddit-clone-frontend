import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps  = InputHTMLAttributes<HTMLInputElement>&{
    name : string;
    label : string;
    textarea? : boolean;
};

export const InputField : React.FC<InputFieldProps> = ({label,textarea, size:_,...props}) =>{
   

    const [field,{error}] = useField(props);
    return(
        <FormControl isInvalid={!!error}>
        <FormLabel htmlFor='name'>{label}</FormLabel>
        {!textarea? 
            (<Input {...field} {...props} id={field.name} />):
            (<Textarea {...field} name={props.name} placeholder={props.placeholder} id={field.name} />)
        }
        
        {error?<FormErrorMessage>{error}</FormErrorMessage>:null}
        </FormControl>
    )
} 