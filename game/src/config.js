// Odd Twin — configuration: the levels, the clock and the scoring.
// One job: every number the rest of the game agrees on lives here.

/** Logical size of one picture panel, in scene units. Both panels draw the same scene. */
export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 480;

/** How many differences hide in every level. */
export const DIFFERENCES_PER_LEVEL = 7;

/** Seconds on the clock when a level starts. */
export const LEVEL_TIME_SECONDS = [150, 150, 180];

/** Points for marking a difference, and the penalty for a wrong click. */
export const POINTS_PER_FIND = 100;
export const POINTS_WRONG_CLICK = -10;

/** Seconds a wrong click costs, and how long a hint ring stays visible. */
export const WRONG_CLICK_TIME_PENALTY = 5;
export const HINT_SECONDS = 2.5;

/** Hints handed out per level. */
export const HINTS_PER_LEVEL = 3;

/** Time bonus per second left when a level is cleared. */
export const TIME_BONUS_PER_SECOND = 5;

/** The three levels: name, subtitle, difficulty stars (1-3) and the clock. */
export const LEVELS = [
  {
    id: 'park',
    name: 'Sunny Park',
    tagline: 'A lazy afternoon — if you look closely.',
    stars: 1,
    seconds: LEVEL_TIME_SECONDS[0],
  },
  {
    id: 'kitchen',
    name: 'Cozy Kitchen',
    tagline: 'Tea is brewing. Something is off.',
    stars: 2,
    seconds: LEVEL_TIME_SECONDS[1],
  },
  {
    id: 'camp',
    name: 'Night Camp',
    tagline: 'The fire crackles. The dark hides things.',
    stars: 3,
    seconds: LEVEL_TIME_SECONDS[2],
  },
];

/** localStorage key for the best total score. */
export const BEST_KEY = 'oddtwin.best';

/** Fixed seeds, so a staged screenshot always paints the same frame. */
export const SHOT_SEEDS = { start: 7, play: 11, level2: 23, win: 42 };
