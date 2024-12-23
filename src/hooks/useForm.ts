import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useForm({ defaultData, rules }: { defaultData: any, rules: any }) {

    const [formData, setFormData] = useState(defaultData);
    const [disabled, setDisabled] = useState(false);
    const [errors, setErrors] = useState(defaultData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleChange(e: any) {
        setErrors(defaultData);
        setDisabled(false);
        if (e.target.name.length > 0) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    }

    function validate() {
        setDisabled(true);
        let flag = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = {};
        const keys = Object.keys(formData);
        keys.forEach(key => {
            if (rules[key]?.required && formData[key]?.length === 0) {
                result[key] = { ...result[key], type: 'required' };
                setDisabled(false);
                flag = false;
            }
            if (rules[key]?.minLength && formData[key]?.length < rules[key]?.minLength) {
                result[key] = { ...result[key], type: 'minLength' };
                setDisabled(false);
                flag = false;
            }
            if (rules[key]?.maxLength && formData[key]?.length > rules[key]?.maxLength) {
                result[key] = { ...result[key], type: 'maxLength' };
                setDisabled(false);
                flag = false;
            }
        })
        setErrors(result);
        return flag;
    }

    function reset() {
        setErrors(defaultData);
        setFormData(defaultData);
        setDisabled(false);
    }

    return {
        formData,
        setFormData,
        handleChange,
        disabled,
        setDisabled,
        validate,
        reset,
        errors
    }
}