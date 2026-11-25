import {
  Browser,
  CursorClick,
  LinkSimple,
  MagnifyingGlass,
  MapPin,
  Megaphone,
  Sparkle,
} from "@phosphor-icons/react/ssr";
import type { ServiceIcon as IconName } from "@/data/services";

const icons = {
  browser: Browser,
  search: MagnifyingGlass,
  map: MapPin,
  sparkle: Sparkle,
  link: LinkSimple,
  megaphone: Megaphone,
  cursor: CursorClick,
} as const;

/** A service's filled Phosphor icon, server-rendered. */
export function ServiceIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon weight="fill" aria-hidden className={className} />;
}
