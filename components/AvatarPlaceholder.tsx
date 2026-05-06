type AvatarPlaceholderProps = {
  label: string;
  size?: "sm" | "lg";
  imageUrl?: string | null;
};

export function AvatarPlaceholder({
  label,
  imageUrl,
  size = "sm",
}: AvatarPlaceholderProps) {
  return (
    <div
      aria-label={label}
      className={`avatar avatar-${size}`}
      role="img"
    >
      {imageUrl ? (
        <img
          alt={label}
          className="avatar-image"
          loading="lazy"
          src={imageUrl}
        />
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}
