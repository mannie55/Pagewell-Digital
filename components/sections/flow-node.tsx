import Image, { type StaticImageData } from "next/image";

type Icon = StaticImageData;

export function FlowNode({
  icon,
  label,
  framed = false,
}: {
  icon: Icon;
  label: string;
  /** Glyph-only icons need the Flamingo Light tile drawn around them. */
  framed?: boolean;
}) {
  return (
    <div className="border-border flex h-[5.25rem] min-w-0 flex-col items-start gap-2 rounded-sm border bg-white px-1.5 py-2 md:p-3.5">
      <span
        className={
          framed ? "bg-flamingo-light flex size-6 rounded-sm" : "flex size-6"
        }
      >
        <Image src={icon} alt="" width={24} height={24} />
      </span>
      {/* Short labels never split mid-word on narrow phones. */}
      <span className="text-tiny md:text-small w-full leading-tight font-semibold wrap-normal md:leading-normal">
        {label}
      </span>
    </div>
  );
}
