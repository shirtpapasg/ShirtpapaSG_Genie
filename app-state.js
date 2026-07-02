/* =============================================================================
   Science Claw — SHARED APP STATE  (window.SciClawState)
   -----------------------------------------------------------------------------
   This is the single source of truth that links every screen of the app
   (the Shirtpapa Genie, the 3D Claw Machine, the Login/HUD, the teacher
   console) into ONE product. Every screen reads and writes the SAME two
   localStorage records through this module — so credits earned in the Genie
   are instantly spendable in the claw machine, and questions the Genie banks
   become questions the game can serve.

   Drop this file in the repo root and load it ONCE per page:
       <script src="app-state.js"></script>
   then call e.g. SciClawState.addCredits(10) or SciClawState.getBank().

   ── THE CONTRACT ────────────────────────────────────────────────────────────
   KEY  sciclaw:player:v1   → player object (shape matches the game's App.jsx)
        { name, studentClass, credits, streak, prizes, correct, attempted,
          collection: { Battery, Atom, Plant, Magnet, Crystal } }
   KEY  sciclaw:bank:v1      → array of questions
        { topic, level, ask, clauses:[{cecl,t}], by, ts, source? }

   ── THE ECONOMY ─────────────────────────────────────────────────────────────
   A student earns credits by proving learning, then spends them on claw drops.
     • Game MCQ correct ............ +3   (existing)
     • Genie twin question correct .. +3   (deep work — gated on TRANSFER:
                                            credits are awarded ONLY when the
                                            twin is correct, never for just
                                            finishing the breakdown)
     • Full Science Collection ..... +25 / +50 bonus (existing)
   ========================================================================== */
(function () {
  var PLAYER_KEY = 'sciclaw:player:v1';
  var BANK_KEY   = 'sciclaw:bank:v1';

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function defaultPlayer() {
    return { name: 'Guest', studentClass: 'P5', credits: 3, streak: 0,
             prizes: 0, correct: 0, attempted: 0, collection: {} };
  }

  var State = {
    KEYS: { player: PLAYER_KEY, bank: BANK_KEY },

    /* reward table — see "THE ECONOMY" above */
    REWARD_MCQ_CORRECT: 3,
    REWARD_TWIN_CORRECT: 3,    // Genie, gated on a correct twin (proof of transfer)
    REWARD_BREAKDOWN: 0,       // finishing a breakdown alone earns nothing

    /* the questions every new player starts with (shared across every screen) */
    DEFAULT_BANK: [
      { topic: 'Magnets', level: 'P5', by: 'You', ts: Date.now() - 2 * 86400000,
        ask: 'Andy brought the South pole of a magnet near ends A and B of hanging Object Y. Near A it moved closer; near B it moved away. Is Object Y a magnet? Explain.',
        clauses: [
          { cecl: 'choice', t: 'Yes, Object Y is a magnet.' },
          { cecl: 'evidence', t: 'When the South pole was brought near part B, Object Y moved away from the magnet.' },
          { cecl: 'concept', t: 'Only magnets can repel each other, when like poles are facing each other.' },
          { cecl: 'link', t: 'Thus, Object Y is a magnet.' },
        ] },
      { topic: 'Heat', level: 'P4', by: 'You', ts: Date.now() - 5 * 86400000,
        ask: 'A metal spoon is left in a bowl of hot soup. After a while the handle feels hot. Explain why.',
        clauses: [
          { cecl: 'evidence', t: 'The handle of the metal spoon became hot.' },
          { cecl: 'concept', t: 'Metal is a good conductor of heat; heat travels from the hot soup along the spoon.' },
          { cecl: 'link', t: 'Thus, the handle feels hot.' },
        ] },
    ],

    /* ---- player wallet & stats ---- */
    defaultPlayer: defaultPlayer,
    getPlayer: function () { return Object.assign(defaultPlayer(), read(PLAYER_KEY, {})); },
    savePlayer: function (p) { write(PLAYER_KEY, p); return p; },
    patchPlayer: function (partial) { return this.savePlayer(Object.assign(this.getPlayer(), partial)); },
    addCredits: function (n) { var p = this.getPlayer(); p.credits = (p.credits || 0) + n; return this.savePlayer(p); },
    spendCredits: function (n) { var p = this.getPlayer(); p.credits = Math.max(0, (p.credits || 0) - n); return this.savePlayer(p); },
    recordAttempt: function (correct) {
      var p = this.getPlayer();
      p.attempted = (p.attempted || 0) + 1;
      if (correct) { p.correct = (p.correct || 0) + 1; p.streak = (p.streak || 0) + 1; }
      else { p.streak = 0; }
      return this.savePlayer(p);
    },

    /* ---- shared question bank ---- */
    getBank: function () { return read(BANK_KEY, null); },
    saveBank: function (arr) { write(BANK_KEY, arr || []); return arr || []; },
    seedBank: function (arr) { var b = this.getBank(); if (!b || !b.length) { this.saveBank(arr); return arr; } return b; },
    addToBank: function (item) { var b = this.getBank() || []; b.unshift(item); this.saveBank(b); return b; },

    /* utility */
    reset: function () { try { localStorage.removeItem(PLAYER_KEY); localStorage.removeItem(BANK_KEY); } catch (e) {} },
  };

  if (typeof window !== 'undefined') window.SciClawState = State;
  if (typeof module !== 'undefined' && module.exports) module.exports = State;
})();
