/**
 * Ayıcık demo — in-browser stand-in for the Firebase compat API.
 *
 * Replaces the three firebase-*-compat.js scripts. It fakes exactly the part of the API the app
 * uses (initializeApp, auth(), firestore() with doc/collection refs, set with merge, update,
 * delete, get, add, onSnapshot, where('=='), orderBy, limit, FieldValue.serverTimestamp) and keeps
 * the whole "database" in localStorage under one key. Nothing leaves the browser.
 *
 * Also: seeds demo data on the first sign-in (js demo seed section below), provides no-op shims for
 * the removed Google Drive helpers, and wires the "Sıfırla" link of the demo ribbon.
 *
 * Keys in localStorage: demo-db (the database), demo-auth (signed-in e-mail), demo-seeded (flag).
 */
(function () {
  'use strict';

  var DB_KEY = 'demo-db';
  var AUTH_KEY = 'demo-auth';
  var SEEDED_KEY = 'demo-seeded';
  var UID = 'demo-user';
  var USER_ROOT = 'users/' + UID;

  /* ── safe storage ───────────────────────────────────────────────────────── */

  function lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }
  function lsRemove(key) {
    try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  /* ── values ─────────────────────────────────────────────────────────────── */

  function makeTimestamp(ms) {
    return {
      __ts: ms,
      seconds: Math.floor(ms / 1000),
      nanoseconds: (ms % 1000) * 1e6,
      toMillis: function () { return ms; },
      toDate: function () { return new Date(ms); },
      toJSON: function () { return { __ts: ms }; }
    };
  }

  function isTimestamp(v) {
    return v && typeof v === 'object' && typeof v.toMillis === 'function';
  }

  function isPlain(v) {
    return v && typeof v === 'object' && !Array.isArray(v) && !isTimestamp(v);
  }

  function isSentinel(v) {
    return v && typeof v === 'object' && v.__demo === 'serverTimestamp';
  }

  /** Deep copy; a sentinel becomes the current time, a stored {__ts} becomes a timestamp. */
  function resolve(v) {
    if (isSentinel(v)) return makeTimestamp(Date.now());
    if (isTimestamp(v)) return makeTimestamp(v.toMillis());
    if (Array.isArray(v)) return v.map(resolve);
    if (isPlain(v)) {
      if (typeof v.__ts === 'number' && Object.keys(v).length === 1) return makeTimestamp(v.__ts);
      var out = {};
      for (var k in v) { if (Object.prototype.hasOwnProperty.call(v, k)) out[k] = resolve(v[k]); }
      return out;
    }
    return v;
  }

  function merge(target, src) {
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      if (isPlain(src[k]) && !isSentinel(src[k]) && isPlain(target[k])) merge(target[k], src[k]);
      else target[k] = resolve(src[k]);
    }
    return target;
  }

  function compare(a, b) {
    var x = isTimestamp(a) ? a.toMillis() : a;
    var y = isTimestamp(b) ? b.toMillis() : b;
    if (x === y) return 0;
    if (x === null || x === undefined) return -1;
    if (y === null || y === undefined) return 1;
    return x < y ? -1 : 1;
  }

  /* ── database (persisted) ───────────────────────────────────────────────── */

  var store = {};
  var _autoId = 0;
  var _listeners = [];

  function loadStore() {
    try {
      var raw = lsGet(DB_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      store = {};
      Object.keys(parsed).forEach(function (path) {
        store[path] = {};
        Object.keys(parsed[path]).forEach(function (id) {
          store[path][id] = resolve(parsed[path][id]);
        });
      });
    } catch (e) {
      store = {};
    }
  }

  function persist() {
    try {
      window.localStorage.setItem(DB_KEY, JSON.stringify(store));
    } catch (e) {
      console.warn('demo: could not save to this browser (storage full or blocked)', e);
    }
  }

  function col(path) {
    if (!store[path]) store[path] = {};
    return store[path];
  }

  function lastSegment(path) { return path.split('/').pop(); }
  function parentOf(path) { return path.slice(0, path.lastIndexOf('/')); }

  function newId() {
    _autoId += 1;
    return 'd' + Date.now().toString(36) + _autoId.toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function schedule(l) {
    setTimeout(function () { if (l.active) l.emit(); }, 0);
  }

  function notify(colPath) {
    _listeners.slice().forEach(function (l) {
      if (l.active && l.colPath === colPath) schedule(l);
    });
  }

  function addListener(colPath, emit) {
    var l = { colPath: colPath, active: true, emit: emit };
    _listeners.push(l);
    schedule(l);
    return function unsubscribe() {
      l.active = false;
      var i = _listeners.indexOf(l);
      if (i >= 0) _listeners.splice(i, 1);
    };
  }

  /* ── references ─────────────────────────────────────────────────────────── */

  function docSnapshot(id, data) {
    return {
      id: id,
      exists: data !== undefined,
      metadata: { hasPendingWrites: false, fromCache: false },
      data: function () { return data === undefined ? undefined : resolve(data); }
    };
  }

  function makeDocRef(path) {
    var colPath = parentOf(path);
    var id = lastSegment(path);
    return {
      id: id,
      path: path,
      collection: function (name) { return makeCollectionRef(path + '/' + name); },
      set: function (data, opts) {
        var docs = col(colPath);
        if (opts && opts.merge && docs[id]) merge(docs[id], data);
        else docs[id] = resolve(data);
        persist();
        notify(colPath);
        return Promise.resolve();
      },
      update: function (data) {
        var docs = col(colPath);
        if (!docs[id]) return Promise.reject(new Error('demo: update of a missing document ' + path));
        for (var field in data) {
          if (!Object.prototype.hasOwnProperty.call(data, field)) continue;
          var parts = field.split('.');
          var at = docs[id];
          for (var i = 0; i < parts.length - 1; i++) {
            if (!isPlain(at[parts[i]])) at[parts[i]] = {};
            at = at[parts[i]];
          }
          at[parts[parts.length - 1]] = resolve(data[field]);
        }
        persist();
        notify(colPath);
        return Promise.resolve();
      },
      delete: function () {
        delete col(colPath)[id];
        persist();
        notify(colPath);
        return Promise.resolve();
      },
      get: function () {
        return Promise.resolve(docSnapshot(id, col(colPath)[id]));
      },
      onSnapshot: function (cb) {
        return addListener(colPath, function () { cb(docSnapshot(id, col(colPath)[id])); });
      }
    };
  }

  /** Collection / query reference. Immutable: where/orderBy/limit return a new one. */
  function makeCollectionRef(path, query) {
    var q = query || { filters: [], order: null, max: null };

    function derive(patch) {
      return makeCollectionRef(path, {
        filters: patch.filters || q.filters,
        order: patch.order !== undefined ? patch.order : q.order,
        max: patch.max !== undefined ? patch.max : q.max
      });
    }

    function rows() {
      var docs = col(path);
      var list = Object.keys(docs).map(function (id) { return { id: id, data: docs[id] }; });
      q.filters.forEach(function (f) {
        list = list.filter(function (r) { return compare(r.data[f.field], f.value) === 0; });
      });
      if (q.order) {
        list.sort(function (a, b) {
          var c = compare(a.data[q.order.field], b.data[q.order.field]);
          return q.order.dir === 'desc' ? -c : c;
        });
      }
      if (q.max !== null) list = list.slice(0, q.max);
      return list;
    }

    function snapshot() {
      var list = rows().map(function (r) { return docSnapshot(r.id, r.data); });
      return {
        size: list.length,
        empty: list.length === 0,
        docs: list,
        forEach: function (fn) { list.forEach(fn); }
      };
    }

    return {
      path: path,
      doc: function (id) { return makeDocRef(path + '/' + (id || newId())); },
      add: function (data) {
        var id = newId();
        col(path)[id] = resolve(data);
        persist();
        notify(path);
        return Promise.resolve(makeDocRef(path + '/' + id));
      },
      where: function (field, op, value) {
        if (op !== '==') throw new Error("demo: where() supports '==' only, got " + op);
        return derive({ filters: q.filters.concat([{ field: field, value: value }]) });
      },
      orderBy: function (field, dir) { return derive({ order: { field: field, dir: dir || 'asc' } }); },
      limit: function (n) { return derive({ max: n }); },
      get: function () { return Promise.resolve(snapshot()); },
      onSnapshot: function (cb) {
        return addListener(path, function () { cb(snapshot()); });
      }
    };
  }

  /* ── auth ───────────────────────────────────────────────────────────────── */

  function makeAuth() {
    var listeners = [];
    var email = lsGet(AUTH_KEY);
    var currentUser = email ? { uid: UID, email: email } : null;

    function deliver(cb) {
      /* The first sign-in (and every restored session) seeds the demo data before the app reads. */
      if (currentUser) ensureSeed();
      cb(currentUser);
    }

    function notifyAuth() {
      listeners.forEach(function (cb) { setTimeout(function () { deliver(cb); }, 40); });
    }

    return {
      get currentUser() { return currentUser; },
      onAuthStateChanged: function (cb) {
        listeners.push(cb);
        /* Never instant, like the real SDK: later <script> tags finish parsing first. */
        setTimeout(function () { deliver(cb); }, 40);
        return function unsubscribe() {
          var idx = listeners.indexOf(cb);
          if (idx >= 0) listeners.splice(idx, 1);
        };
      },
      signOut: function () {
        currentUser = null;
        lsRemove(AUTH_KEY);
        notifyAuth();
        return Promise.resolve();
      },
      signInWithEmailAndPassword: function (mail, password) {
        if (!mail || !password) {
          var err = new Error('demo: e-mail and password are required');
          err.code = 'auth/invalid-credential';
          return Promise.reject(err);
        }
        currentUser = { uid: UID, email: mail };
        lsSet(AUTH_KEY, mail);
        notifyAuth();
        return Promise.resolve({ user: currentUser });
      }
    };
  }

  var _auth = null;
  var _db = null;

  function firestore() {
    if (!_db) {
      _db = {
        collection: function (name) { return makeCollectionRef(name); },
        enablePersistence: function () { return Promise.resolve(); }
      };
    }
    return _db;
  }
  firestore.FieldValue = {
    serverTimestamp: function () { return { __demo: 'serverTimestamp' }; }
  };

  loadStore();

  window.firebase = {
    initializeApp: function () { /* no project — nothing to do */ },
    auth: function () {
      if (!_auth) _auth = makeAuth();
      return _auth;
    },
    firestore: firestore
  };

  /* ── Google Drive shims (Drive uploads were removed; photos go to the database only) ─────── */

  window.ensureGoogleAuth = function () {
    return Promise.reject(new Error('Demo: Drive yok, fotoğraf bu tarayıcıda saklanır.'));
  };
  window.uploadToDrive = function () {
    return Promise.reject(new Error('Demo: Drive yok.'));
  };
  window.deleteFromDrive = function () { /* nothing to delete */ };
  window.getDriveImageUrl = function (fileId) {
    return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1600';
  };

  /* ── demo seed ──────────────────────────────────────────────────────────── */

  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  /** A placeholder "photo": sky gradient, sun, two hills, a heart. No faces, no files. */
  var PALETTES = [
    ['#FFD8C2', '#F06A8F', '#C93A6E', '#9E2F5B'],
    ['#E6DAFB', '#B9A2F0', '#7C5CC4', '#5A3FA0'],
    ['#CDEBF5', '#7CC6E0', '#2E9DC4', '#0A6F94'],
    ['#FFE9B8', '#FFC169', '#F28C38', '#C2571A'],
    ['#D9F2D0', '#9BDB8C', '#55B05A', '#2F7D3B'],
    ['#FFE3EA', '#FFB3C7', '#F06A8F', '#B53A63'],
    ['#E0E8FF', '#A5B8F5', '#5F7BDB', '#3A53AE'],
    ['#FFEBD6', '#F7C79A', '#D98B52', '#A35A2A']
  ];

  function makePlaceholderPhoto(width, height, index) {
    var pal = PALETTES[index % PALETTES.length];
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    if (!ctx) return '';
    var rnd = mulberry32(1000 + index * 7919);

    var sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, pal[0]);
    sky.addColorStop(1, pal[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(width * (0.2 + rnd() * 0.6), height * (0.2 + rnd() * 0.15), height * 0.1, 0, Math.PI * 2);
    ctx.fill();

    function hill(baseY, amp, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, baseY);
      var phase = rnd() * 6;
      for (var x = 0; x <= width; x += Math.max(2, width / 40)) {
        ctx.lineTo(x, baseY + Math.sin(x / width * 5 + phase) * amp);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }
    hill(height * 0.66, height * 0.06, pal[2]);
    hill(height * 0.82, height * 0.05, pal[3]);

    var hx = width * (0.25 + rnd() * 0.5);
    var hy = height * 0.55;
    var s = height * 0.07;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.moveTo(hx, hy + s);
    ctx.bezierCurveTo(hx - s * 2, hy - s * 0.4, hx - s * 0.6, hy - s * 1.6, hx, hy - s * 0.5);
    ctx.bezierCurveTo(hx + s * 0.6, hy - s * 1.6, hx + s * 2, hy - s * 0.4, hx, hy + s);
    ctx.fill();

    try { return canvas.toDataURL('image/jpeg', 0.72); } catch (e) { return ''; }
  }

  var DEMO_MEMORIES = [
    { title: 'Galata Kulesi\'nde gün batımı', date: '2026-05-02', note: 'Örnek anı: kulenin dibinde simit, martılar ve uzun bir yürüyüş.', lat: 41.0256, lng: 28.9742 },
    { title: 'Moda sahilinde yürüyüş', date: '2026-05-23', note: 'Örnek anı: sahil boyunca yürüyüp dondurma yedik.', lat: 40.9876, lng: 29.0258 },
    { title: 'Emirgan Korusu\'nda piknik', date: '2026-06-14', note: 'Örnek anı: çimenlerde battaniye, sandviç ve kitap.', lat: 41.1085, lng: 29.0550 },
    { title: 'Kadıköy çarşısında kahve', date: '2026-07-04', note: 'Örnek anı: dar sokaklarda küçük bir kahve molası.', lat: 40.9903, lng: 29.0230 },
    { title: 'Kız Kulesi önünde çay', date: '2026-07-26', note: 'Örnek anı: Üsküdar sahilinde çay ve gün batımı.', lat: 41.0211, lng: 29.0041 },
    { title: 'Ortaköy\'de boğaz manzarası', date: '2026-08-15', note: 'Örnek anı: iskelede oturup vapurları izledik.', lat: 41.0476, lng: 29.0268 },
    { title: 'Belgrad Ormanı yürüyüşü', date: '2026-09-06', note: 'Örnek anı: ağaçların arasında uzun ve sakin bir patika.', lat: 41.1814, lng: 28.9894 },
    { title: 'Büyükada\'da bisiklet', date: '2026-09-27', note: 'Örnek anı: adada bisiklet turu ve limonata.', lat: 40.8590, lng: 29.1257 }
  ];

  var DEMO_TODOS = [
    { text: 'Hafta sonu için kahvaltı yeri bul', done: false },
    { text: 'Birlikte yeni bir film seç', done: true },
    { text: 'Fotoğraf albümünü tamamla', done: false },
    { text: 'Akşam yürüyüşüne çık', done: false }
  ];

  function seedMemories() {
    var docs = col(USER_ROOT + '/memories');
    DEMO_MEMORIES.forEach(function (m, i) {
      var id = 'demo-memory-' + (i + 1);
      docs[id] = {
        title: m.title,
        date: m.date,
        note: m.note,
        lat: m.lat,
        lng: m.lng,
        source: 'map',
        thumbnail: makePlaceholderPhoto(240, 180, i),
        photo: makePlaceholderPhoto(640, 480, i)
      };
    });
  }

  function seedTodos() {
    var docs = col(USER_ROOT + '/todos');
    var base = Date.now() - DEMO_TODOS.length * 60000;
    DEMO_TODOS.forEach(function (t, i) {
      docs['demo-todo-' + (i + 1)] = { text: t.text, done: t.done, createdAt: makeTimestamp(base + i * 60000) };
    });
  }

  function parseDay(s) {
    var p = String(s).split('-');
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }

  function seedHabits() {
    var cfg = (typeof CONFIG !== 'undefined') ? CONFIG : null;
    if (!cfg || !cfg.habits) return;
    var now = new Date(); /* the real clock: a birthday rehearsal never seeds */
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var startParts = String(cfg.habitsStart || '').split('-');
    var first = startParts.length === 2
      ? new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1, 1)
      : new Date(today.getFullYear(), today.getMonth() - 1, 1);
    /* never more than the 12 latest months, never before the configured start */
    var earliest = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    if (first < earliest) first = earliest;
    var logFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1); /* log: previous + current month */

    var months = col(USER_ROOT + '/habitMonths');
    var log = col(USER_ROOT + '/habitLog');
    var logN = 0;
    var chance = { elif: 0.86, can: 0.74 };

    for (var cursor = new Date(first); cursor <= today; cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)) {
      var mk = cursor.getFullYear() + '-' + pad2(cursor.getMonth() + 1);
      var days = {};
      var last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
      for (var d = 1; d <= last; d++) {
        var date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
        if (date > today) break;
        var dk = mk + '-' + pad2(d);
        var weekday = date.getDay() >= 1 && date.getDay() <= 5;
        cfg.habits.forEach(function (item) {
          if (item.since && date < parseDay(item.since)) return;
          if (item.until && date > parseDay(item.until)) return;
          if (item.weekdaysOnly && !weekday) return;
          (item.owners || []).forEach(function (person) {
            var rnd = mulberry32(hashString(dk + '|' + item.id + '|' + person));
            var p = chance[person] === undefined ? 0.75 : chance[person];
            if (date.getTime() === today.getTime()) p = p * 0.45;
            if (rnd() >= p) return;
            if (!days[dk]) days[dk] = {};
            if (!days[dk][item.id]) days[dk][item.id] = {};
            days[dk][item.id][person] = true;
            if (cursor >= logFrom) {
              var at = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8 + Math.floor(rnd() * 14), Math.floor(rnd() * 60), 0);
              logN += 1;
              log['demo-log-' + logN] = {
                month: mk,
                day: dk,
                item: item.id,
                person: person,
                value: true,
                by: person,
                atLocal: at.toISOString(),
                at: makeTimestamp(at.getTime())
              };
            }
          });
        });
      }
      if (Object.keys(days).length) months[mk] = { days: days };
    }
  }

  function ensureSeed() {
    if (lsGet(SEEDED_KEY)) return;
    try {
      seedMemories();
      seedTodos();
      seedHabits();
      persist();
      lsSet(SEEDED_KEY, '1');
    } catch (e) {
      console.warn('demo: seeding failed', e);
    }
  }

  /* ── demo ribbon: "Sıfırla" ─────────────────────────────────────────────── */

  function resetDemo() {
    var drop = [];
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (k && (k.indexOf('demo-') === 0 || k.indexOf('ayicik-') === 0)) drop.push(k);
      }
    } catch (e) { /* ignore */ }
    drop.forEach(lsRemove);
    try {
      var sdrop = [];
      for (var j = 0; j < window.sessionStorage.length; j++) {
        var sk = window.sessionStorage.key(j);
        if (sk && sk.indexOf('ayicik-') === 0) sdrop.push(sk);
      }
      sdrop.forEach(function (key) { window.sessionStorage.removeItem(key); });
    } catch (e2) { /* ignore */ }
    window.location.href = window.location.pathname;
  }
  window.demoReset = resetDemo;

  document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('demo-reset');
    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        resetDemo();
      });
    }
  });
})();
