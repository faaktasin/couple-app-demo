/**
 * Little Bear — Content (English, for the demo)
 * Every word the app shows lives here, under one global CONTENT object. Feature code only READS it.
 * ` ` before a closing emoji is a no-break space: it keeps the emoji on the same line as
 * the word before it. Keep it when you edit such a line.
 * `{n|day|days}` is a plural token: the code picks the first word when the number is 1, else the second.
 */

var CONTENT = {
  greetings: {
    morning: [
      'Good morning ☀️',
      'Good morning, start the day with a smile',
      'Awake yet? A brand-new day is waiting 🌿',
      'Good morning Elif, today is a fresh page',
      'Open your eyes, the sun is already up'
    ],
    afternoon: [
      'How is your day going? I was wondering',
      'Take a little break, drink some water 💧',
      'Take a short breather on your lunch break',
      'I hope your day is going nicely',
      'Time for a tiny breather 🌤️'
    ],
    evening: [
      'Have a lovely evening 🌆',
      'The day is over, time to unwind',
      'Another day is behind us',
      'Evening has come, the lights are on',
      'How was your day? Tell me all about it'
    ],
    night: [
      'Good night Elif, sleep tight 🌙',
      'Close your eyes, tomorrow is a new day',
      'Sleep well, we will be right here tomorrow',
      'The stars are so bright tonight ⭐',
      'The night is beautiful too, sweet dreams'
    ],
    /* Her birthday (all day) replaces the time-of-day line above — Can speaking to her. */
    birthday: [
      'Happy birthday 🎂',
      'Today is your day, happy birthday 🎉',
      'Many happy returns, today is a special day for you 🎂'
    ],
    /* On her birthday this replaces "Today\'s Message" for the whole day. */
    birthdayMessage: 'It is your birthday today. Happy birthday Elif.'
  },

  together: {
    prefix: 'Together for',
    suffix: 'days ✨'
  },

  gate: {
    /* The quiet skip control in the gate's top corner (js/gate.js). */
    skip: { label: 'Skip', aria: 'Skip the questions' },
    yesLabel: 'Yes 💗',
    noLabels: [
      'No',
      'Are you sure?',
      'Really? 🥺',
      'Think again',
      'No way 😉',
      'I am getting sad 🥲',
      'You are breaking my heart 💔',
      'I am going to cry 😭',
      'Do not do this 😢',
      'This is your last chance',
      'This button is stuck',
      'Almost there, a little more',
      'There is no such option 💗'
    ],
    /* The reply is Can's answer after she presses Yes. */
    opener: {
      q: 'Elif, are you ready?',
      reply: 'Wonderful, let us begin ✨'
    },
    pool: [
      { q: 'Did you smile today?', reply: 'How lovely, keep going 😄' },
      { q: 'Fancy a cup of tea?', reply: 'The kettle is on ☕' },
      { q: 'Shall we go for a little walk?', reply: 'Grab your coat, we are heading out 🚶' },
      { q: 'Did you learn something new today?', reply: 'Curiosity is a lovely thing 📚' },
      { q: 'Will you pick the next song?', reply: 'Added to the playlist 🎵' },
      { q: 'Shall we look at the stars together?', reply: 'I am bringing the blanket ✨' }
    ],
    birthday: [
      { q: 'Today is a special day, do you know?', reply: 'Today is your birthday 🎂' },
      { q: 'Are you ready to see the surprise?', reply: 'Then here we go! 🎁' }
    ],
    meter: {
      q: 'So how excited are you?',
      steps: ['A little', 'A lot', 'A whole lot', 'As big as the world', 'Infinite ∞'],
      button: 'This much!'
    },
    finale: {
      title: 'Wonderful, we are ready',
      text: 'This text is a sample and will be replaced with the real one.',
      button: 'Come on in 💕',
      birthdayButton: 'Open your surprise 🎁'
    }
  },

  words: {
    /* Small messages on the Words tab, in Can's voice. */
    ui: {
      favEmpty: 'You have no favorite quotes yet. Tap the heart to add one 💗',   // favourites filter is on but empty
      jarHint: 'Tap the jar and a little note will pop out 💌',                   // under the jar, before/while drawing
      jarReshuffled: 'You read them all! The jar is shuffling again 🔄'            // after all reasons were drawn
    },
    quotes: [
      {
        text: 'A sample quote, first line,\nsecond line right here,\nthird line at the end.',
        author: 'Sample',
        source: 'Sample text'
      },
      {
        text: 'This is a sample quote.\n…\nThe real text loads after you sign in.',
        author: 'Sample',
        source: 'Sample text'
      },
      {
        text: 'Small things build big days.',
        author: 'Sample',
        source: 'Sample text'
      },
      {
        text: 'Every journey starts with one step,\nand this step is yours.',
        author: 'Sample',
        source: 'Sample text'
      }
    ],
    lines: [
      'This is a sample sentence.',
      'Take one small step today.',
      'Good days suit you.',
      'A cup of tea, a book, a calm evening.',
      'Smiling is contagious.',
      'Enjoy today.',
      'Go slowly, but do not give up.',
      'Something lovely is coming, I can feel it.'
    ],
    reasons: [
      'This is a sample note: your smile lights up the room.',
      'This is a sample note: you know how to enjoy the small things.',
      'This is a sample note: because you are patient and kind.',
      'This is a sample note: your curiosity never ends.',
      'This is a sample note: because it feels so easy to be around you.',
      'This is a sample note: the real notes load after you sign in.'
    ],
    letters: [
      {
        id: 'miss',
        title: 'When you miss me',
        emoji: '💌',
        birthdayOnly: false,
        body: [
          'This is a sample letter, written for a moment of missing someone.',
          'Whatever the distance, you will be talking again soon.',
          'Take a breath and smile, that moment is very close.'
        ]
      },
      {
        id: 'sad',
        title: 'When you are bored',
        emoji: '🤍',
        birthdayOnly: false,
        body: [
          'If you are feeling down, take a deep breath first.',
          'This feeling is temporary, you are permanent.',
          'Talk if you want to, stay quiet if you want to; both are fine.'
        ]
      },
      {
        id: 'sleep',
        title: 'When you cannot sleep',
        emoji: '🌙',
        birthdayOnly: false,
        body: [
          'If your eyes are still open, let these lines slowly rock you to sleep.',
          'Leave today behind, tomorrow will still be there.',
          'Close your eyes and let sweet dreams find you.'
        ]
      },
      {
        id: 'angry',
        title: 'When you are angry',
        emoji: '🐻',
        birthdayOnly: false,
        body: [
          'If you are angry, you have a reason, and I understand.',
          'Saying sorry is not hard, I never want to upset you.',
          'Let us talk when the anger has passed.'
        ]
      },
      {
        id: 'laugh',
        title: 'When you feel like laughing',
        emoji: '😄',
        birthdayOnly: false,
        body: [
          'Want to laugh? Picture this: a penguin sliding on the ice.',
          'In a full suit, with a very serious face.',
          'Now give me a smile.'
        ]
      },
      {
        id: 'lonely',
        title: 'When you feel lonely',
        emoji: '💗',
        birthdayOnly: false,
        body: [
          'Loneliness sometimes sneaks right inside a person.',
          'But someone is thinking of you, right here.',
          'Write whenever you like, call whenever you like.'
        ]
      },
      {
        id: 'proud',
        title: 'When you want to feel proud',
        emoji: '✨',
        birthdayOnly: false,
        body: [
          'Today might be a day to be proud of yourself.',
          'Small or big, every step you take counts.',
          'Everything you achieved is your own hard work.'
        ]
      },
      {
        id: 'bday',
        title: 'Birthday morning',
        emoji: '🎂',
        birthdayOnly: true,
        body: [
          'The first thing I want you to know when you open your eyes today: today is your day.',
          'This is a sample letter and will be replaced with the real text.',
          'Happy birthday Elif, have a wonderful day.'
        ]
      }
    ]
  },

  dates: {
    /* Engagement card: days since the engagement date (CONFIG.engagementDate). */
    engagementLabel: 'Since our special day',
    /* Wedding card. CONFIG.wedding holds the date; while only the month is known it shows months. */
    weddingLabel: 'Until the big day',
    weddingApprox: 'about {months} {months|month|months} to go',          // {months} is filled in
    weddingThisMonth: 'The big day is this month 🎉',
    weddingDone: 'The big day has come 🎉',
    hisToday: 'It is his birthday today 🎉'          // his card, on his birthday
  },

  birthday: {
    /* The 🎁 tab card once the surprise is unlocked (Can speaking to her). */
    ready: {
      title: 'Your surprise is waiting! 🎉',
      firstTime: 'Tap to start the surprise 🎁',                   // before she has opened it this year
      again: 'Open it again whenever you like 💗'   // after she has opened it
    },
    balloonsPrompt: 'Pick a balloon, a wish will come out 🎈',            // above the balloons scene
    locked: {
      title: 'There is a surprise in here 🎁',
      subtitle: 'But it is locked until your birthday 🔒',
      teases: [
        'Wait a little, {days} {days|day|days} to go 🙈',
        'No peeking, the lock is solid 🔒',
        'This section opens on your birthday',
        'We meet back here in {days} {days|day|days}',
        'A little patience, the surprise is on its way 😉',
        'The lock is still on, wait a bit more 🔒'
      ]
    },
    title: 'Happy birthday Elif',
    wish: 'Close your eyes and make a wish.',
    blow: {
      prompt: 'Blow out the candles!',
      micButton: 'Turn on the microphone and blow 🎤',
      tapHint: 'Or tap the candles to put them out',
      micDenied: 'No microphone permission? No problem, just tap the candles 💗'
    },
    afterBlow: 'Your wish is saved, may lovely things happen ✨',
    balloons: [
      'May this new year of your life bring you happiness 🎈',
      'May your smile never fade.',
      'May your wishes come true.',
      'May this year bring lovely things.',
      'May your joy always be with you.',
      'May you find a little happiness every day.',
      'Happy birthday to you 🎂',
      'To many more beautiful years.'
    ],
    gift: {
      prompt: 'I have a gift for you.',
      open: 'Open your gift 🎁'
    },
    letter: {
      greeting: 'Dear Elif,',
      paragraphs: [
        'This is a sample letter. The real letter loads after you sign in.',
        'The second paragraph is sample text too; there is no one\'s memory in it.',
        'The third paragraph was written only to show the page layout.',
        'The fourth paragraph: a short, simple text that suits everyone.',
        'The fifth paragraph is a placeholder as well.',
        'The sixth paragraph: I wish your new year brings you beautiful days.',
        'The seventh paragraph: this text will be replaced with the real letter.',
        'Happy birthday.'
      ],
      signature: 'Sincerely, Can'
    },
    /* Scene after the letter: his recorded voice message (audio/voice-message.*). Skipped when no file. */
    voice: {
      title: 'And there is a voice note for you',
      hint: 'Turn up the sound, then tap 🎧',
      play: 'Play',
      pause: 'Pause'
    },
    /* Love coupons: his offers to her. Shown as a scene in the surprise and kept on the 🎁 tab. */
    coupons: {
      title: 'Your birthday coupons 🎟️',
      hint: 'Tap a coupon whenever you like, show it to me, and I will take care of the rest 💌',
      confirm: 'Do you want to use this coupon now?',
      yes: 'Yes, use it',
      no: 'Later',
      used: 'Used',
      items: [
        { id: 'hug', emoji: '🤗', title: 'Sample coupon: a hug', text: 'This is a sample coupon.' },
        { id: 'yourday', emoji: '👑', title: 'Sample coupon: your day', text: 'This is a sample coupon.' },
        { id: 'trip', emoji: '🗺️', title: 'Sample coupon: a little trip', text: 'This is a sample coupon.' },
        { id: 'dinner', emoji: '🍽️', title: 'Sample coupon: dinner', text: 'This is a sample coupon.' },
        { id: 'walk', emoji: '🌙', title: 'Sample coupon: a walk', text: 'This is a sample coupon.' },
        { id: 'win', emoji: '🏳️', title: 'Sample coupon: the last word', text: 'This is a sample coupon.' },
        { id: 'letter', emoji: '💌', title: 'Sample coupon: a letter', text: 'This is a sample coupon.' },
        { id: 'wish', emoji: '🎁', title: 'Sample coupon: a wish', text: 'This is a sample coupon.' }
      ]
    },
    slideshow: {
      title: 'Our lovely memories 📸'
    },
    end: {
      title: 'Happy birthday 💗',
      button: 'Come on in 💕'
    }
  },

  /* Habits (js/habits.js). Voice: "we" - the two of us, warm and short. Nothing here says who
     does what between them; a line names a person only where a box belongs to that person. */
  habits: {
    me: {
      title: 'Who am I?',
      sub: 'Who will tick the boxes on this phone?',
      line: 'Me:',
      change: 'change',
      cancel: 'Cancel'
    },
    today: {
      title: 'Today',
      hint: 'Tap your own heart, it lights up as you go. When we both finish, the heart in the middle lights up 💞'
    },
    notStarted: {
      title: 'We start on October 1',
      sub: 'The boxes open here that day 🐻'
    },
    groups: { together: 'Together', elif: 'Elif', can: 'Can' },
    legendJoint: 'both of us',
    noData: '—',
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    stats: {
      lead: 'Ahead: {name} (+{n} {n|point|points})',
      tie: 'Neck and neck 💞',
      jointDays: '{n} {n|day|days} both done',
      streakDays: '{n} {n|day|days}',
      streakNow: 'streak',
      streakBest: 'longest streak'
    },
    daily: {
      title: 'Day by day',
      aria: 'Day by day, percentages for every day of the month. This month Elif {m}, Can {f}'
    },
    bars: { title: 'Habit by habit' },
    mom: {
      title: 'Month by month',
      hint: 'Percentages for each month'
    },
    report: {
      title: '{month} report card',
      best: 'Most consistent habit: {item} ({pct})',
      streak: '{name} longest streak: 🔥 {n} {n|day|days}',
      teaser: 'Our report card shows up here when the month ends 🐻',
      closing: [
        'One more month behind us 👏',
        'A month of step-by-step progress 🌷',
        'Keeping steady feels good 🌱',
        'Let us keep going next month too 💪',
        'It was a good month 🌟',
        'The month is complete, we are ready for the next ✨'
      ]
    },
    log: {
      title: 'History',
      empty: 'No ticks in this month yet',
      undone: 'undid it',
      pending: 'saving',
      box: 'box: {name}',
      all: 'See all ({n})',
      less: 'Show less'
    },
    sheetEmpty: 'No boxes for this day',
    readError: 'We could not reach the records, let us refresh the page\u00a0💗',
    previewNote: 'Nothing is saved in preview\u00a0💗',
    saveError: 'We could not save that, let us tap again 💗',
    dow: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    aria: {
      done: 'done',
      notDone: 'not done',
      locked: '{name} ticks this one',
      jointOn: 'we both did it',
      jointOff: 'lights up when we both do it',
      prev: 'Previous month',
      next: 'Next month',
      day: '{day}: Elif {m}%, Can {f}%'
    }
  },

  /* The private-texts loader and its import/export panel (js/private.js). Interface strings only:
     the texts themselves are never written here, they arrive from the signed-in account. */
  privateTexts: {
    loadError: 'Private texts could not be loaded',
    panel: {
      title: 'Private texts',
      hint: 'Upload a JSON file or download the saved texts.',
      choose: 'Choose file',
      download: 'Download',
      saved: 'Texts saved. Refresh the page 💗',
      invalid: 'Invalid file: {reason}',
      saveError: 'Texts could not be saved',
      noDocument: 'No saved texts',
      downloadError: 'Texts could not be downloaded'
    }
  }
};
