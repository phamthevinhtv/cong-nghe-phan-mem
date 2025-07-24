import { useState } from "react";

const useInputValid = (validateFn, initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const isValid = validateFn(value);
  const error = touched && !isValid;

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setTouched(true);
  };

  const onFocus = () => {};

  return {
    value,
    setValue,
    isValid,
    error,
    touched,
    onChange,
    onBlur,
    onFocus,
  };
};

export default useInputValid;
