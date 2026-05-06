type FormFieldProps = {
  label: string;
  name: string;
  placeholder: string;
  multiline?: boolean;
  type?: "text" | "number";
  helperText?: string;
  defaultValue?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "decimal";
  min?: number;
  step?: number | "any";
};

export function FormField({
  label,
  name,
  placeholder,
  multiline = false,
  type = "text",
  helperText,
  defaultValue,
  disabled = false,
  autoComplete,
  inputMode,
  min,
  step,
}: FormFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea
          className="field-input field-textarea"
          defaultValue={defaultValue}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          rows={5}
        />
      ) : (
        <input
          className="field-input"
          defaultValue={defaultValue}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          min={min}
          name={name}
          placeholder={placeholder}
          step={step}
          type={type}
        />
      )}
      {helperText ? <span className="helper-text">{helperText}</span> : null}
    </label>
  );
}
