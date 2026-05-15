interface FormInputProps{
    label: string;
    id: string;
    desc: string;
    type: string;
    min?: number;
    max?: number;
}

function FormInput({label, id, desc, type, min, max}: FormInputProps){
    return(
        <>
            <div className="regLabels">
                <label htmlFor={id}>{label}</label>
                <p>{desc}</p>
            </div>
            <input className="input" id={id} type={type}
                   minLength={min} maxLength={max} required={true}/>
        </>
    )
}

export default FormInput;