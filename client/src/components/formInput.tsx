interface FormInputProps {
    label: string;
    id: string;
    desc: string;
    type: string;
    min?: number;
    max?: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormInput({label, id, desc, type, min, max, value, onChange}: FormInputProps) {
    return (
        <>
            <div className="regLabels">
                <label htmlFor={id}>{label}</label>
                <p>{desc}</p>
            </div>
            <input
                className="input"
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                minLength={min}
                maxLength={max}
                required
            />
        </>
    );
}

export default FormInput;