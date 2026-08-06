import type { IconName } from "@/components/icons";

/* ===============================================================
   THE SIX STATES OF THE RESEARCH JOURNEY

   One table, imported by every part of section 05, so the question,
   the rail step and the panel that answers it can never drift apart.
   The dictionary's `questions`, `steps` and `ui` panels are all
   index-matched to the constants below.
   =============================================================== */

/** The word is read in three languages. */
export const TRANSLATE = 0;
/** Every other place the word is written. */
export const TRACE = 1;
/** One Father, in his own work. */
export const INTERPRET = 2;
/** A second Father, and the graph between them. */
export const COMPARE = 3;
/** The word taken apart. */
export const PARSE = 4;
/** What the word carries with it. */
export const CONTEXT = 5;

export const STATE_COUNT = 6;

/* REST is not a state the scroll can reach: it is the section at rest,
   with every question listed and every panel open at once. It is what
   the server renders, what a reader with no JavaScript keeps, and what
   a reader who has asked for reduced motion keeps — the whole journey
   in one still, rather than a story frozen on frame one. The script
   leaves it for TRANSLATE the moment it takes over.

   (The same convention as section 03; see components/sections/Workspace.tsx.) */
export const REST = -1;

/* The closing statement is a seventh band of scroll. The surface has
   finished answering by then and pulls back to leave one line. */
export const OUTRO = STATE_COUNT;
export const BANDS = STATE_COUNT + 1;

/* Each band is a little under a viewport, so seven bands cost about six
   screens of scroll rather than seven. Below ~0.8 the states start
   cutting into each other; above ~1 the section outstays its welcome. */
export const BAND_HEIGHT = 0.9;

/* The site header is fixed and floats over everything. The pinned block
   is parked below it rather than under it, or the question — which is the
   first thing in the block and the largest type in the section — spends
   the whole journey sliced in half by the navigation.

   Kept here rather than in the component because two places have to agree
   about it: the pin's start offset and the block's own height, which is a
   viewport less this. */
export const HEADER_CLEARANCE = 104;

/* The rail's marks, in scroll order. */
export const STEP_ICONS: IconName[] = [
  "translate",
  "search",
  "reading",
  "network",
  "analyze",
  "notes",
];
