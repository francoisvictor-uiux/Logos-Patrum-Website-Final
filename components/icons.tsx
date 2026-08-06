/* ===============================================================
   ICONS — Phosphor, duotone, everywhere.

   Every icon on the site comes from @phosphor-icons/react at the
   duotone weight: one family, one weight, one optical size. The
   names below are ours, not Phosphor's, so a section asks for
   "citation" or "network" and this table decides what that looks
   like — swap an icon here and it changes across the site rather
   than in one component.

   Imported from the `/ssr` entry, which renders plain SVG with no
   client context, so these work in server and client components
   alike. Sized by the caller with `size-*`; coloured by
   `currentColor`. Phosphor's duotone puts the tinted backdrop at
   opacity 0.2 under the solid path, which is why nothing here sets
   a stroke: these are filled marks, not line art.
   =============================================================== */
import {
  ArrowRight,
  BookOpen,
  BookOpenText,
  Books,
  Brain,
  CaretCircleLeft,
  CaretDown,
  ChartBar,
  Check,
  FolderOpen,
  Globe,
  Lock,
  MagnifyingGlass,
  NotePencil,
  Quotes,
  Scan,
  Scroll,
  ShareNetwork,
  ShieldCheck,
  SquaresFour,
  Translate,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/* The caret inside the primary CTA buttons. Authored pointing left, which is
   "forward" in Arabic — mirrored in LTR so it keeps pointing along the reading
   direction. */
export function CaretCircle({ className }: { className?: string }) {
  return (
    <CaretCircleLeft weight="duotone" aria-hidden className={cn("ltr:-scale-x-100", className)} />
  );
}

/* The hero's capability row asks for these four by name from the dictionary. */
export const duotone = {
  magnifyingGlass: MagnifyingGlass,
  bookOpenText: BookOpenText,
  brain: Brain,
  books: Books,
} as const;

export type DuotoneName = keyof typeof duotone;

export function DuotoneIcon({ name, className }: { name: DuotoneName; className?: string }) {
  const Cmp = duotone[name];
  return <Cmp weight="duotone" aria-hidden className={className} />;
}

/* The page-wide set. Names are the site's vocabulary; the right-hand side is
   the Phosphor mark that carries it. */
export const icons = {
  translate: Translate,
  translation: Translate,
  /* Ancient text as an object — the closest mark to a manuscript. */
  greek: Scroll,
  search: MagnifyingGlass,
  citation: Quotes,
  /* Panels, which is what the workspace is. */
  workspace: SquaresFour,
  notes: NotePencil,
  collections: FolderOpen,
  reading: BookOpen,
  check: Check,
  chevron: CaretDown,
  arrow: ArrowRight,
  globe: Globe,
  analyze: ChartBar,
  shield: ShieldCheck,
  lock: Lock,
  users: UsersThree,
  network: ShareNetwork,
  scan: Scan,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = icons[name];
  return <Cmp weight="duotone" aria-hidden className={className} />;
}
