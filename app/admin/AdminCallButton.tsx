"use client";

type Props = {
  phone: string | null | undefined;
  compact?: boolean;
};

function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : `tel:${phone.trim()}`;
}

export default function AdminCallButton({ phone, compact = false }: Props) {
  const cleaned = phone?.trim();
  if (!cleaned || cleaned === "-") return null;

  return (
    <a
      className={`admin-call-btn${compact ? " is-compact" : ""}`}
      href={telHref(cleaned)}
      onClick={(e) => e.stopPropagation()}
    >
      Anrufen
    </a>
  );
}
