/**
 * Ayıcık — Data & Configuration
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
    memories: 'ayicik-memories',
    todos: 'ayicik-todos'
  },
  /* "Takip" (js/habits.js). The first month the tracker shows; every month from here to the
     current one exists by itself. */
  habitsStart: DEMO_FIRST_DAY_KEY.slice(0, 7),
  people: { can: 'Can', elif: 'Elif' },
  /* The list. `owners` = who ticks it, `weekdaysOnly` = due Mon-Fri only, `since` / optional
     `until` = the dates it is active (so changing the list never rewrites old months). */
  habits: [
    { id: 'esneme', label: 'Esneme', owners: ['can', 'elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Örnek not: birlikte beş dakika esneyeceğiz' },
    { id: 'gunluk', label: 'Günlük yazma', owners: ['can', 'elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Örnek not: günün bir cümlesini yazacağız' },
    { id: 'nefes', label: 'Nefes egzersizi', owners: ['elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Örnek not: sakin bir nefes molası' },
    { id: 'bitki', label: 'Bitkileri sulama', owners: ['elif'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Örnek not: saksılara göz at' },
    { id: 'erken', label: 'Erken kalkma', owners: ['can'], weekdaysOnly: true, since: DEMO_FIRST_DAY_KEY, note: 'Örnek not: hafta içi erken kalk' },
    { id: 'foto', label: 'Fotoğraf çekme', owners: ['can'], weekdaysOnly: false, since: DEMO_FIRST_DAY_KEY, note: 'Örnek not: günde bir kare' }
  ],
};

const LOVE_MESSAGES = [
  'Bu bir örnek mesajdır.',
  'Bugün güzel bir gün olsun.',
  'Küçük bir gülümseme günü değiştirir.',
  'Bir adım at, gerisi gelir.',
  'Bugün kendine iyi davran.',
  'Güzel şeyler yolda.',
  'Derin bir nefes al ve devam et.',
  'Bu mesaj örnek amaçlıdır.',
  'Her gün yeni bir başlangıç.',
  'Sakin ve güçlü kal.',
  'Bugün de harika gidiyorsun.',
  'Gerçek mesajlar giriş yapınca yüklenir.'
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
