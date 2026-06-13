import Image from "next/image";

export default function UserAvatar({
  image,
  name,
  size = 40,
}: {
  image?: string | null;
  name?: string | null;
  size?: number;
}) {
  if (image) {
    return (
      <Image
        alt={name ? `Foto de ${name}` : "Foto de perfil"}
        className="rounded-full ring-2 ring-white"
        height={size}
        src={image}
        width={size}
      />
    );
  }

  return (
    <div
      aria-label="Avatar sin fotografía"
      className="grid rounded-full bg-slate-200 font-semibold text-slate-700 place-items-center"
      style={{ height: size, width: size }}
    >
      {name?.charAt(0).toUpperCase() ?? "U"}
    </div>
  );
}
