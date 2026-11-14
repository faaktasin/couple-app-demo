/**
 * Little Bear — Data & Configuration
 * Love messages, date utilities, and app constants.
 */

/* Demo: the first tracked day is the 1st of the previous month (see tools/build-demo.mjs). */
var DEMO_FIRST_DAY = (function () {
  var d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
})();
var DEMO_FIRST_DAY_KEY = DEMO_FIRST_DAY.getFullYear() + '-' + ('0' + (DEMO_FIRST_DAY.getMonth() + 1)).slice(-2) + '-01';

const CONFIG = {
  name: 'Elif',
  firstMeetDate: new Date('2024-09-21T00:00:00'),
  loveDate: new Date('2024-11-09T00:00:00'),
  engagementDate: new Date('2025-12-06T00:00:00'),
  wedding: { year: 2028, month: 6, day: null },
  herBirthday: { month: 9, day: 17 },
  hisBirthday: { month: 2, day: 6 },
  mapCenter: [41.0150, 28.9800], // Istanbul
  mapZoom: 11,
  maxPhotoWidth: 600,
  storageKeys: {
    memories: 'littlebear-memories',
    todos: 'littlebear-todos'
  },
  /* "Habits" (js/habits.js). The first month the tracker shows; every month from here to the
     current one exists by itself. */
  habitsStart: DEMO_FIRST_DAY_KEY.slice(0, 7),
  people: { can: 'Can', elif: 'Elif' },
  /* The list. `owners` = who ticks it, `weekdaysOnly` = due Mon-Fri only, `since` / optional
     `until` = the dates it is active (so changing the list never rewrites old months). */
  habits: [
    { id: 'stretch', label: 'Stretching', owners: ['can', 'elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Sample note: five minutes of stretching together' },
    { id: 'journal', label: 'Journaling', owners: ['can', 'elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Sample note: we write one sentence about the day' },
    { id: 'breathe', label: 'Breathing exercise', owners: ['elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Sample note: a calm breathing break' },
    { id: 'plants', label: 'Watering the plants', owners: ['elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Sample note: check on the pots' },
    { id: 'early', label: 'Waking up early', owners: ['can'], weekdaysOnly: true, since: DEMO_FIRST_DAY_KEY, note: 'Sample note: get up early on weekdays' },
    { id: 'photo', label: 'Taking a photo', owners: ['can'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Sample note: one frame a day' }
  ],
};

const LOVE_MESSAGES = [
  'This is a sample message.',
  'Have a lovely day today.',
  'A small smile can change the day.',
  'Take one step, the rest will follow.',
  'Be kind to yourself today.',
  'Good things are on the way.',
  'Take a deep breath and keep going.',
  'This message is only a sample.',
  'Every day is a new beginning.',
  'Stay calm and strong.',
  'You are doing great today too.',
  'The real messages load after you sign in.'
];

/**
 * Returns a deterministic daily index so the same message shows all day.
 * @param {Date} date
 * @returns {number}
 */
function getDailyMessageIndex(date) {
  const daysSinceEpoch = Math.floor(date.getTime() / 86400000);
  return ((daysSinceEpoch * 2654435761) >>> 0) % LOVE_MESSAGES.length;
}

/**
 * Returns today's love message.
 * @returns {string}
 */
function getDailyMessage() {
  return LOVE_MESSAGES[getDailyMessageIndex(appNow())];
}

/**
 * Returns a random message different from the current one.
 * @param {string} currentMessage
 * @returns {string}
 */
function getRandomMessage(currentMessage) {
  var msg;
  do {
    msg = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
  } while (msg === currentMessage && LOVE_MESSAGES.length > 1);
  return msg;
}

/**
 * Calculates time remaining until the anniversary.
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, passed: boolean }}
 */
function getElapsed(sinceDate) {
  var now = appNow();
  var diff = now - sinceDate;

  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
}

function getNextBirthdayCountdown(month, day) {
  var now = appNow();

  /* Compare CALENDAR DATES first, not a midnight instant — a plain `now < midnight-of-birthday`
     check made the whole day AFTER midnight read as "already passed", so the countdown fell all
     the way through to next year's birthday (~364 days) instead of staying at {today:true} for
     the rest of the day. */
  var isToday = now.getMonth() === (month - 1) && now.getDate() === day;
  if (isToday) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, today: true };
  }

  var thisYear = new Date(now.getFullYear(), month - 1, day);
  var target = now < thisYear ? thisYear : new Date(now.getFullYear() + 1, month - 1, day);
  var diff = target - now;

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    today: false
  };
}
