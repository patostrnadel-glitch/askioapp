type AvatarPlaceholderProps = {
  label: string;
  size?: "sm" | "lg";
};

export function AvatarPlaceholder({
  label,
  size = "sm",
}: AvatarPlaceholderProps) {
  return (
    <div
      aria-label={label}
      className={`avatar avatar-${size}`}
      role="img"
    >
      <span>{label}</span>
    </div>
  );
}
