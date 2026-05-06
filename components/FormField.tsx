type FormFieldProps = {
  label: string;
  name: string;
  placeholder: string;
  multiline?: boolean;
  type?: "text" | "number";
  helperText?: string;
  defaultValue?: string;
};

export function FormField({
  label,
  name,
  placeholder,
  multiline = false,
  type = "text",
  helperText,
  defaultValue,
}: FormFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea
          className="field-input field-textarea"
          defaultValue={defaultValue}
          name={name}
          placeholder={placeholder}
          rows={5}
        />
      ) : (
        <input
          className="field-input"
          defaultValue={defaultValue}
          name={name}
          placeholder={placeholder}
          type={type}
        />
      )}
      {helperText ? <span className="helper-text">{helperText}</span> : null}
    </label>
  );
}
