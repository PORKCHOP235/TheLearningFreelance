// Creative HQ v5 on the Resources page.
// Twelve private offices on a ring of hallways, with a kitchen and lounge in the middle.
// Each agent works at their desk, then walks the work to the next person's office,
// takes a coffee break in the kitchen, and walks back. Visitors can rotate, tilt, zoom
// and move the office, click anyone to talk to them, and switch how production is done.
(() => {
  const root = document.getElementById('ai-team');
  if (!root) return;
  const panel = root.querySelector('.hq-panel');
  const scene = root.querySelector('.hq-scene');
  const world = root.querySelector('.hq-world');
  const floor = root.querySelector('.hq-floor');
  const offices = [...root.querySelectorAll('.hq-office')].sort((a, b) => a.dataset.step - b.dataset.step);
  const items = [...root.querySelectorAll('.hq-steps li')];
  const token = root.querySelector('.hq-token');
  const log = root.querySelector('.hq-log');
  const client = root.querySelector('.hq-client');
  const now = root.querySelector('.hq-now');
  const pauseBtn = root.querySelector('.hq-pause');
  const voiceBtn = root.querySelector('.hq-voice');
  const card = root.querySelector('.hq-card');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const S = 'social-media-skills:';
  const AGENTS = {
    jonel: { name: 'Jonel', role: 'Team lead', step: 0, about: 'I run the team. I take your brief, set the monthly plan, and make sure every step happens on time.',
      skills: ['small-business:content-strategy', S + 'social-strategy', S + 'batch-content-plan', 'small-business:marketing-monday'],
      hi: 'Hi, I’m Jonel. Welcome to the HQ! Click anyone to meet them.', how: 'Every Monday I use marketing-monday to plan the week and batch-content-plan to line up the posts.',
      tips: ['Start with one goal per month. More sales, more bookings, or more followers, not all three.', 'Give the team one hour a month of your time. That’s enough for the brief and approvals.'] },
    ava: { name: 'Ava', role: 'Business analyst', step: 1, about: 'I study your business first: goals, audience, offers, and what competitors are doing.',
      skills: [S + 'brand-profile', S + 'audience-research', S + 'competitor-analysis', S + 'goals-and-kpis', S + 'social-strategy'],
      hi: 'Hi! I’m Ava. I make sure every post has a business reason behind it.', how: 'brand-profile captures your voice, audience-research finds your buyers, and goals-and-kpis turns it into numbers we track.',
      tips: ['Know your one main offer for the month. Every post should lead back to it.', 'Look at your 3 closest competitors. Copy their format, not their content.'] },
    theo: { name: 'Theo', role: 'Topic researcher', step: 2, about: 'I find what your customers are talking about and searching for right now.',
      skills: ['last30days', S + 'content-research-and-sourcing', S + 'trend-jacking', S + 'content-pillars', S + 'social-seo', S + 'idea-generation-and-ideation'],
      hi: 'Hey, I’m Theo. I live in the comments and search bars.', how: 'last30days shows what people said this month, and social-seo finds the words they search with.',
      tips: ['Answer the questions customers ask you in person. Those make the best posts.', 'Use 3 to 5 content pillars so your page feels consistent.'] },
    iris: { name: 'Iris', role: 'Outlier researcher', step: 3, about: 'I find posts that did 5 to 10 times better than normal, then work out why.',
      skills: [S + 'viral-reverse-engineering', S + 'competitor-analysis', S + 'content-audit', 'last30days'],
      hi: 'Hi, I’m Iris. I hunt for outliers, the posts that beat the average.', how: 'viral-reverse-engineering breaks a hit post into its hook, format, length, and sound so we can reuse what worked.',
      tips: ['Don’t copy viral posts. Copy the structure and make it about your business.', 'An outlier is measured against that account’s average, not against famous creators.'] },
    leo: { name: 'Leo', role: 'Copywriter', step: 4, about: 'I write the hooks, captions, and calls to action that make people stop and act.',
      skills: [S + 'hook-writer', S + 'caption-writer', S + 'carousel-writer', S + 'voice-builder', S + 'writing-style-and-tone'],
      hi: 'Yo, I’m Leo. I write the first line you can’t scroll past.', how: 'hook-writer gives me 10 openers, and caption-writer keeps them in your brand voice.',
      tips: ['Your first line does 80% of the work. Write five hooks and pick the best one.', 'End every caption with one clear action: order, book, or comment.'] },
    mia: { name: 'Mia', role: 'Script writer', step: 5, about: 'I turn the idea into a reel script and a shot list the crew can follow.',
      skills: [S + 'reels-script', S + 'short-form-video-script', S + 'scripting-and-storyboarding', S + 'tiktok-script', S + 'storytelling-and-narrative'],
      hi: 'Hi, I’m Mia! I plan every second of the reel.', how: 'reels-script writes the beats, and scripting-and-storyboarding turns them into shots.',
      tips: ['Show the result in the first 2 seconds, then explain how you got there.', 'A shot list saves hours on shoot day. Never film without one.'] },
    marco: { name: 'Marco', role: 'Photo & video', step: 6, mode: 'shoot', about: 'I shoot photos and film reels on site at your business: products, people, and the space.',
      skills: [S + 'platform-specs-and-validation', S + 'scripting-and-storyboarding', S + 'talking-head-and-piece-to-camera', S + 'behind-the-scenes-and-founder', S + 'before-after-and-transformation'],
      hi: 'Hey, I’m Marco. Natural light and real moments, that’s my thing.', how: 'platform-specs-and-validation tells me the exact sizes before I shoot, so nothing gets cropped badly.',
      tips: ['Shoot near a window. Natural light beats any filter.', 'Take vertical and horizontal versions of every shot.'] },
    nova: { name: 'Nova', role: 'AI visual generator', step: 6, mode: 'gen', about: 'When there’s no time to shoot, I generate images and short video with AI tools.',
      skills: [S + 'veo-3', S + 'kling', S + 'runway', S + 'nano-banana', S + 'flux', S + 'image-prompt', S + 'ai-image-editing'],
      hi: 'Hello, I’m Nova. Give me a prompt and I’ll make the visuals.', how: 'image-prompt writes the prompt, nano-banana or flux makes the image, and veo-3, kling or runway animate it.',
      tips: ['Use AI for backgrounds and concepts, but keep real photos of your actual product.', 'Always label AI visuals where the platform asks you to.'] },
    remy: { name: 'Remy', role: 'Creative librarian', step: 6, mode: 'reuse', about: 'I dig through your old photos and videos and give the best ones a second life.',
      skills: [S + 'content-recycling', S + 'cross-platform-repurposing', S + 'captions-and-clipping', S + 'opus-clip'],
      hi: 'Hi, I’m Remy. Your old content is a gold mine.', how: 'content-recycling finds past winners, and opus-clip cuts long videos into short clips.',
      tips: ['Repost your best performer from 6 months ago with a new hook.', 'One long video can become 5 to 10 short clips.'] },
    dani: { name: 'Dani', role: 'Video editor', step: 7, about: 'I cut the footage, add subtitles, music, and b-roll, and keep it fast.',
      skills: [S + 'capcut', S + 'descript', S + 'captions-and-clipping', S + 'ai-music-and-sound', S + 'ai-voiceover'],
      hi: 'Hey, I’m Dani. I turn raw clips into reels people finish watching.', how: 'capcut handles the edit, captions-and-clipping adds subtitles, and ai-music-and-sound finds a beat.',
      tips: ['Cut every pause. Reels under 15 seconds get watched to the end more often.', 'Most people watch muted, so subtitles aren’t optional.'] },
    sky: { name: 'Sky', role: 'Brand review', step: 8, about: 'Before you see it, I check colours, logo, prices, spelling, and anything risky.',
      skills: ['anthropic-skills:brand-guidelines', S + 'brand-profile', S + 'crisis-and-moderation'],
      hi: 'Hi, I’m Sky. Nothing off-brand gets past me.', how: 'brand-guidelines checks the look, and crisis-and-moderation flags anything that could cause trouble.',
      tips: ['Keep one page with your colours, fonts, and words you never use.', 'Double-check prices and dates. They’re the most common mistakes.'] },
    you: { name: 'You', role: 'Business owner', step: 8, at: 'sky', about: 'You get the final say. Nothing goes live until you approve it.',
      skills: [], hi: 'This is you! One click to approve, or leave a comment for changes.', how: 'You don’t need any skills here. Just approve or ask for changes.',
      tips: ['Reply within a day so posts go out on time.', 'Give feedback as “change X to Y” so the team can fix it fast.'] },
    pip: { name: 'Pip', role: 'Finishing artist', step: 9, about: 'I add the final touches: covers, sizes for every platform, hashtags, and alt text.',
      skills: [S + 'thumbnail-design', S + 'canva', S + 'hashtag-strategy', S + 'instagram-seo', S + 'platform-specs-and-validation'],
      hi: 'Hi, I’m Pip! I make it look perfect everywhere.', how: 'thumbnail-design makes the cover, and platform-specs-and-validation checks every size.',
      tips: ['Put 3 to 5 words on your cover so people know what the reel is about.', 'Write alt text. It helps accessibility and search.'] },
    sol: { name: 'Sol', role: 'Scheduler', step: 10, about: 'I post at the times your audience is online, on every platform.',
      skills: [S + 'scheduling-and-queue', S + 'content-calendar', S + 'instagram-reels-publishing', S + 'tiktok-video-publishing', S + 'youtube-publishing-and-metadata'],
      hi: 'Hey, I’m Sol. Right post, right time, right place.', how: 'content-calendar holds the plan, and scheduling-and-queue posts it at the best times.',
      tips: ['Post when your audience is online, not when you have time.', 'Keep a 2-week buffer of posts ready to go.'] },
    max: { name: 'Max', role: 'Content auditor', step: 11, about: 'I measure what worked and feed it back into next month’s plan.',
      skills: [S + 'analytics-and-reporting', S + 'content-audit', S + 'experimentation-and-ab-testing', S + 'goals-and-kpis'],
      hi: 'Hi, I’m Max. Numbers tell us what to make next.', how: 'analytics-and-reporting builds the report, and experimentation-and-ab-testing tests two hooks against each other.',
      tips: ['Track saves and shares, not just likes.', 'Change one thing at a time so you know what made the difference.'] },
  };

  // Lines: [step, agent, status, text]. 'PROD' is replaced by the current production mode's lines.
  const RUNS = [
    { client: 'Bakery café', piece: 'Pie reel', lines: [
      [1, 'ava', 'Working', 'Holiday pre-orders are the goal. Families within 5 miles are the audience.'],
      [2, 'theo', 'Working', 'People are searching “Thanksgiving pie near me”. That’s our topic.'],
      [3, 'iris', 'Working', 'A slow-motion pie cut got 8× the usual views in our niche. Let’s use that format.'],
      [4, 'leo', 'Working', 'Hook: “The pie we sold out of in 3 hours last year.” Caption and CTA ready.'],
      [5, 'mia', 'Working', 'Script done. Five shots: crust, filling, oven, slow cut, pre-order sign.'],
      'PROD',
      [7, 'dani', 'Editing', 'Cut to 12 seconds, synced to the beat, subtitles on.'],
      [8, 'sky', 'Checking', 'Brand check done: colours, logo, and price are right.'],
      [8, 'you', 'Approved', 'Looks great. Approved!'],
      [9, 'pip', 'Working', 'Cover, 9:16 and 4:5 sizes, hashtags, and alt text added.'],
      [10, 'sol', 'Working', 'Scheduled for Thursday 6:30 PM on Instagram, Facebook, and TikTok.'],
      [11, 'max', 'Working', 'Saves are up 40% on reels. Next month: more behind-the-scenes.'],
    ], prod: {
      shoot: [[6, 'marco', 'Filming', 'Rolling! Slow-motion pie cut is in the bag.'], [6, 'marco', 'Shooting', 'Carousel photos are done too.']],
      gen: [[6, 'nova', 'Generating', 'Generated a cozy autumn table scene and animated the steam rising from the pie.']],
      reuse: [[6, 'remy', 'Searching', 'Found last year’s pie clips. Re-cut them with fresh shots from the archive.']],
    }},
    { client: 'Home cleaning company', piece: 'Before & after reel', lines: [
      [1, 'ava', 'Working', 'Goal is more quote requests. Busy parents are the audience.'],
      [2, 'theo', 'Working', 'Spring cleaning checklists are trending this month.'],
      [3, 'iris', 'Working', 'Before-and-after reels with a timer beat the average by 6×.'],
      [4, 'leo', 'Working', 'Hook: “This closet took us 47 minutes.” CTA: book a free quote.'],
      [5, 'mia', 'Working', 'Shot list: wide before, 3 time-lapses, the reveal, the client’s reaction.'],
      'PROD',
      [7, 'dani', 'Editing', 'Added the timer, a trending sound, and captions.'],
      [8, 'sky', 'Checking', 'No personal details show in the shots. All clear.'],
      [8, 'you', 'Approved', 'Love it. Approved!'],
      [9, 'pip', 'Working', 'Cover frame picked, local hashtags and alt text added.'],
      [10, 'sol', 'Working', 'Going live Saturday 9 AM, when parents scroll the most.'],
      [11, 'max', 'Working', 'Quote requests from reels doubled. More before-and-afters next month.'],
    ], prod: {
      shoot: [[6, 'marco', 'Filming', 'Time-lapse is running. Don’t touch the tripod!'], [6, 'marco', 'Shooting', 'Reveal shot captured. The client loved it.']],
      gen: [[6, 'nova', 'Generating', 'Made a clean, bright “after” mood shot for the cover. Real before-and-after stays real.']],
      reuse: [[6, 'remy', 'Searching', 'Pulled 4 past before-and-afters and stitched them into a “month of makeovers” reel.']],
    }},
  ];

  let mode = 'shoot', run = 0, visible = false, paused = false, voices = false, selected = null, typing = 0;
  const lastSaid = {};
  const linesFor = r => RUNS[r].lines.flatMap(l => (l === 'PROD' ? RUNS[r].prod[mode] : [l]));
  const avEl = id => root.querySelector(`.av[data-agent="${id}"]`);
  const running = () => visible && !paused && !selected;
  const HANDOFF = {
    1: 'Here’s the audience brief.', 2: 'Topic is locked in.', 3: 'These are the outliers to copy.', 4: 'Hooks and captions are ready.',
    5: 'Script and shot list for you.', 6: 'Footage is in.', 7: 'Edit’s done, ready for review.', 8: 'Approved! Ready for final touches.',
    9: 'All sized and tagged.', 10: 'It’s live. Over to you for tracking.', 11: 'Report’s ready for next month’s plan.',
  };

  /* ---------- Pause-aware clock: timers and walking only advance while running ---------- */
  const timers = new Set();
  const wait = ms => new Promise(res => timers.add({ left: ms, res }));
  let last = performance.now();
  function frame(t) {
    const dt = Math.min(64, t - last); last = t;
    if (running()) {
      for (const tm of [...timers]) { tm.left -= dt; if (tm.left <= 0) { timers.delete(tm); tm.res(); } }
      for (const w of walkers.values()) step(w, dt);
      for (const c of cats) catStep(c, dt);
      followTick(t);
      if (holder) { const w = walkers.get(holder); token.style.left = `${w.x}px`; token.style.top = `${w.y}px`; }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Walkers ---------- */
  const P = s => s.split('|').map(q => q.split(',').map(Number));
  const walkers = new Map();
  root.querySelectorAll('.av').forEach(el => {
    const [x, y] = el.dataset.home.split(',').map(Number);
    walkers.set(el.dataset.agent, { id: el.dataset.agent, el, x, y, path: [], res: null, at: 'seat', home: [x, y], out: P(el.dataset.out), vin: P(el.dataset.in) });
  });
  const SPEED = 0.2;   // floor px per ms
  function step(w, dt) {
    if (!w.path.length) return;
    let move = SPEED * dt;
    while (move > 0 && w.path.length) {
      const [tx, ty] = w.path[0];
      const dx = tx - w.x, dy = ty - w.y, d = Math.hypot(dx, dy);
      if (d <= move) { w.x = tx; w.y = ty; w.path.shift(); move -= d; }
      else { w.x += dx / d * move; w.y += dy / d * move; move = 0; }
    }
    w.el.style.left = `${w.x}px`; w.el.style.top = `${w.y}px`;
    if (!w.path.length) { w.el.classList.remove('is-walking'); const r = w.res; w.res = null; r && r(); }
  }
  function walk(id, path, status) {
    const w = walkers.get(id);
    w.el.classList.remove('is-seated');
    w.el.classList.add('is-walking');
    if (status) setStatus(id, status);
    w.path = path.slice();
    return new Promise(res => { w.res = res; if (calm) { const [x, y] = path[path.length - 1]; w.path = []; w.x = x; w.y = y; w.el.style.left = `${x}px`; w.el.style.top = `${y}px`; w.el.classList.remove('is-walking'); res(); } });
  }
  function sit(id) { const w = walkers.get(id); w.at = 'seat'; w.el.classList.add('is-seated'); setStatus(id, 'At desk'); }

  // The hallways form a rectangle. Route between two hall points the short way round.
  const RING = [[40, 260], [1520, 260], [1520, 780], [40, 780]];
  const SIDES = RING.map((c, i) => [c, RING[(i + 1) % 4]]);
  const PER = SIDES.reduce((s, [a, b]) => s + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
  function sOf([x, y]) {
    let s = 0, best = null;
    for (const [a, b] of SIDES) {
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const t = Math.max(0, Math.min(1, ((x - a[0]) * (b[0] - a[0]) + (y - a[1]) * (b[1] - a[1])) / (len * len)));
      const px = a[0] + t * (b[0] - a[0]), py = a[1] + t * (b[1] - a[1]), d = Math.hypot(px - x, py - y);
      if (!best || d < best.d) best = { d, s: s + t * len };
      s += len;
    }
    return best.s;
  }
  const cornerS = RING.map(c => sOf(c));
  function ring(p, q) {
    const s1 = sOf(p), s2 = sOf(q);
    const cw = (s2 - s1 + PER) % PER, ccw = PER - cw;
    const out = [];
    if (cw <= ccw) { cornerS.map((s, i) => [((s - s1 + PER) % PER), RING[i]]).filter(([d]) => d > 0 && d < cw).sort((a, b) => a[0] - b[0]).forEach(([, c]) => out.push(c)); }
    else { cornerS.map((s, i) => [((s1 - s + PER) % PER), RING[i]]).filter(([d]) => d > 0 && d < ccw).sort((a, b) => a[0] - b[0]).forEach(([, c]) => out.push(c)); }
    out.push(q);
    return out;
  }
  const rev = a => a.slice().reverse();
  const hallOf = w => (w.at === 'seat' ? w.out[w.out.length - 1] : w.at.hall);
  const exitOf = w => (w.at === 'seat' ? w.out.slice(1) : w.at.exit);
  // Kitchen: enter from the left hall (top-row people) or the bottom hall (bottom-row people).
  const KIN = { top: [[40, 600], [118, 600]], bottom: [[380, 780], [380, 722]] };
  const KSPOTS = [[300, 610], [355, 615], [420, 612], [470, 640], [520, 700], [690, 620], [230, 560]];
  const kTaken = new Set();

  function toVisit(id, targetId) {
    const w = walkers.get(id), t = walkers.get(targetId);
    const start = exitOf(w), h1 = hallOf(w), h2 = t.vin[0];
    const path = [...start, ...ring(h1, h2), ...t.vin.slice(1)];
    const visit = { hall: h2, exit: rev(t.vin).slice(1) };
    w.at = visit;
    return walk(id, path, `Walking to ${AGENTS[targetId].name}`);
  }
  async function breakTime(id) {
    const w = walkers.get(id);
    const spot = KSPOTS.find(s => !kTaken.has(s.join())) || KSPOTS[0];
    kTaken.add(spot.join());
    const kin = w.out[w.out.length - 1][1] < 500 ? KIN.top : KIN.bottom;
    const path = [...exitOf(w), ...ring(hallOf(w), kin[0]), kin[1], spot];
    w.at = { hall: kin[0], exit: [kin[1], kin[0]] };
    await walk(id, path, 'Coffee break');
    setStatus(id, 'Coffee break ☕');
    await wait(5000 + Math.random() * 3000);
    kTaken.delete(spot.join());
    const back = [kin[1], kin[0], ...ring(kin[0], w.out[w.out.length - 1]), ...rev(w.out).slice(1)];
    w.at = 'seat';
    await walk(id, back, 'Back to desk');
    sit(id);
  }
  const homeWait = {};
  async function ensureHome(id) { if (homeWait[id]) await homeWait[id]; }


  /* ---------- Cats: wander the halls, lounge and kitchen; sit, nap, watch the fish ---------- */
  const CAT_SPOTS = [
    [[300, 260]], [[1100, 260]], [[1520, 520]], [[700, 780]], [[40, 420]],
    [[40, 600], [118, 600], [170, 476]],          // kitchen aquarium
    [[380, 780], [380, 690]],                     // kitchen floor
    [[850, 780], [850, 650], [835, 466]],         // lounge aquarium
    [[1350, 780], [1350, 640], [1400, 560]],      // lounge, by the sofa
  ];
  const MEOWS = ['Meow!', 'Purrr…', 'Mrrp?', 'Is it fish time?', 'Pet me, then.'];
  const cats = [...root.querySelectorAll('.hq-cat')].map((el, i) => {
    const spot = [7, 5, 0][i] ?? i;
    const [x, y] = CAT_SPOTS[spot].at(-1);
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    if (i === 1) { el.classList.remove('is-sitting'); el.classList.add('is-sleeping'); }
    return { el, x, y, spot, path: [], rest: 3000 + i * 2500 };
  });
  const catTaken = () => new Set(cats.map(c => c.spot));
  function catStep(c, dt) {
    if (c.path.length) {
      let move = 0.09 * dt;
      while (move > 0 && c.path.length) {
        const [tx, ty] = c.path[0];
        const dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy);
        if (d > 0.01) {
          const r = cam.rz * Math.PI / 180, sx = dx * Math.cos(r) - dy * Math.sin(r);
          c.el.style.setProperty('--flip', sx < 0 ? '-1' : '1');
        }
        if (d <= move) { c.x = tx; c.y = ty; c.path.shift(); move -= d; }
        else { c.x += dx / d * move; c.y += dy / d * move; move = 0; }
      }
      c.el.style.left = `${c.x}px`; c.el.style.top = `${c.y}px`;
      if (!c.path.length) {
        const nap = Math.random() < 0.35;
        c.el.classList.remove('is-walking');
        c.el.classList.add(nap ? 'is-sleeping' : 'is-sitting');
        c.rest = nap ? 8000 + Math.random() * 6000 : 3500 + Math.random() * 5000;
      }
      return;
    }
    c.rest -= dt;
    if (c.rest > 0) return;
    const taken = catTaken();
    const options = CAT_SPOTS.map((_, i) => i).filter(i => !taken.has(i));
    const to = options[Math.floor(Math.random() * options.length)];
    const from = CAT_SPOTS[c.spot], dest = CAT_SPOTS[to];
    c.path = [...rev(from).slice(1), ...ring(from[0], dest[0]), ...dest.slice(1)];
    c.spot = to;
    c.el.classList.remove('is-sitting', 'is-sleeping');
    c.el.classList.add('is-walking');
  }
  function meow(el) {
    const say = el.querySelector('.cat-say');
    say.textContent = `${el.dataset.name}: ${MEOWS[Math.floor(Math.random() * MEOWS.length)]}`;
    say.hidden = false;
    clearTimeout(el._t); el._t = setTimeout(() => { say.hidden = true; }, 2200);
  }

  /* ---------- Fit and camera ---------- */
  let s = 1, sceneH = 600, follow = false, lastUserCam = 0, lastFollow = 0;
  const cam = { rx: 50, rz: -12, z: 1, px: 0, py: 0 };
  // Pan values that put floor point (x, y) in the middle of the box at zoom z.
  function aim(x, y, z = cam.z) {
    const r = cam.rz * Math.PI / 180, t = cam.rx * Math.PI / 180;
    const dx = x - 780, dy = y - 520;
    const X = z * (dx * Math.cos(r) - dy * Math.sin(r));
    const Y = z * (dx * Math.sin(r) + dy * Math.cos(r)) * Math.cos(t);
    return { px: -X, py: sceneH / (2 * s) - 640 - Y + 45 * z };
  }
  const followBtn = root.querySelector('[data-cam="follow"]');
  function setFollow(on) {
    follow = on;
    if (followBtn) { followBtn.setAttribute('aria-pressed', String(on)); }
  }
  function followTick(now) {
    if (!follow || selected || now - lastUserCam < 5000 || now - lastFollow < 450) return;
    lastFollow = now;
    const walker = [...walkers.values()].find(w => w.path.length && getComputedStyle(w.el).display !== 'none');
    const w = walker || (holder && walkers.get(holder));
    if (!w) return;
    const t = aim(w.x, w.y);
    if (Math.abs(t.px - cam.px) + Math.abs(t.py - cam.py) > 10) setCam(t);
  }
  const HOME = { ...cam };
  function fit() {
    s = Math.min(1, scene.clientWidth / 1880);
    world.style.transform = `scale(${s})`;
    // Phones get a taller box, a close-up zoom, and a camera that follows the work.
    const small = s < 0.4;
    const hgt = small ? 460 : Math.max(340, Math.round(1180 * s));
    scene.style.height = `${hgt}px`;
    sceneH = hgt;
    HOME.z = small ? 2.6 : 1;
    HOME.px = 0; HOME.py = 0;
    if (!fit.done) {
      Object.assign(cam, HOME);
      setFollow(small);
      if (small) Object.assign(cam, aim(...(walkers.get('ava') ? [walkers.get('ava').x, walkers.get('ava').y] : [780, 520]), cam.z));
      fit.done = true;
    }
    panel.classList.toggle('hq-small', s < 0.4);
    applyCam();
  }
  function applyCam(c = cam) {
    floor.style.setProperty('--rx', `${c.rx}deg`);
    floor.style.setProperty('--rz', `${c.rz}deg`);
    floor.style.setProperty('--z', String(c.z));
    floor.style.setProperty('--px', `${c.px}px`);
    floor.style.setProperty('--py', `${c.py}px`);
    const r = c.rz * Math.PI / 180, cx = Math.sin(r), cy = Math.cos(r);
    const front = { n: -cy > 0.15, s: cy > 0.15, e: cx > 0.15, w: -cx > 0.15 };
    for (const k of ['n', 's', 'e', 'w']) floor.style.setProperty(`--o${k}`, front[k] ? '0' : '1');
    root.style.setProperty('--ts', String(Math.min(2.6, Math.max(1, 0.62 / (s * c.z)))));
  }
  function setCam(next) { Object.assign(cam, next); cam.z = Math.min(3.2, Math.max(0.6, cam.z)); cam.rx = Math.min(78, Math.max(28, cam.rx)); applyCam(); }
  function focusOn(el, zoom) {
    const target = { ...cam, z: zoom ?? Math.max(cam.z, 2) };
    floor.classList.add('no-anim');
    applyCam(target);
    const sr = scene.getBoundingClientRect(), fr = el.querySelector('.av-fig').getBoundingClientRect();
    const cardSide = !card.hidden && innerWidth > 760 ? 360 : 0;
    target.px += ((sr.left + (sr.width - cardSide) / 2) - (fr.left + fr.width / 2)) / s;
    target.py += ((sr.top + sr.height * 0.6) - (fr.top + fr.height / 2)) / s;
    applyCam(cam);
    void floor.offsetWidth;
    floor.classList.remove('no-anim');
    requestAnimationFrame(() => setCam(target));
  }
  fit();
  addEventListener('resize', fit);

  root.querySelector('.hq-cam-ui').addEventListener('click', e => {
    const b = e.target.closest('[data-cam]'); if (!b) return;
    const a = b.dataset.cam;
    if (a === 'follow') { setFollow(!follow); lastUserCam = 0; return; }
    lastUserCam = performance.now();
    if (a === 'in') setCam({ z: cam.z * 1.3 });
    if (a === 'out') setCam({ z: cam.z / 1.3 });
    if (a === 'left') setCam({ rz: cam.rz - 45 });
    if (a === 'right') setCam({ rz: cam.rz + 45 });
    if (a === 'tilt') setCam({ rx: cam.rx > 60 ? 36 : cam.rx < 44 ? 50 : 68 });
    if (a === 'reset') { setCam({ ...HOME }); lastUserCam = 0; }
  });

  const pts = new Map();
  let drag = null;
  scene.addEventListener('contextmenu', e => e.preventDefault());
  scene.addEventListener('pointerdown', e => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag = { x: e.clientX, y: e.clientY, moved: false, pan: e.shiftKey || e.button === 2, start: { ...cam }, dist: 0, mid: null };
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      drag.dist = Math.hypot(a.x - b.x, a.y - b.y); drag.mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; drag.moved = true;
    }
    scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove', e => {
    if (!drag || !pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && drag.dist) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y), m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      scene.classList.add('is-dragging');
      setCam({ z: drag.start.z * d / drag.dist, px: drag.start.px + (m.x - drag.mid.x) / s, py: drag.start.py + (m.y - drag.mid.y) / s });
      return;
    }
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < (e.pointerType === 'touch' ? 10 : 5)) return;
    lastUserCam = performance.now();
    drag.moved = true;
    scene.classList.add('is-dragging');
    if (drag.pan) setCam({ px: drag.start.px + dx / s, py: drag.start.py + dy / s });
    else setCam({ rz: drag.start.rz + dx * 0.3, rx: drag.start.rx - dy * 0.22 });
  });
  function endDrag(e) {
    const wasClick = drag && !drag.moved && pts.size === 1;
    pts.delete(e.pointerId);
    scene.classList.remove('is-dragging');
    if (wasClick && e.type === 'pointerup') {
      // Pick the nearest visible person or cat to the tap, so small targets are easy to hit.
      let best = null;
      root.querySelectorAll('.av, .hq-cat').forEach(el => {
        const f = el.querySelector('.av-fig, .cat-svg');
        const r = f && f.getBoundingClientRect();
        if (!r || !r.width) return;
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right), dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        const d = Math.hypot(dx, dy);
        if (d < 26 && (!best || d < best.d)) best = { d, el };
      });
      if (best && best.el.classList.contains('hq-cat')) meow(best.el);
      else if (best) select(best.el.dataset.agent);
    }
    if (!pts.size) drag = null;
  }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  scene.addEventListener('wheel', e => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    floor.classList.add('no-anim');
    setCam({ z: cam.z * Math.exp(-e.deltaY * 0.01) });
    requestAnimationFrame(() => floor.classList.remove('no-anim'));
  }, { passive: false });

  /* ---------- Talking ---------- */
  function setStatus(id, text) { const st = avEl(id)?.querySelector('.tag-st'); if (st) st.textContent = text; }
  function say(id, text, { log: addToLog = true, status } = {}) {
    const a = AGENTS[id], av = avEl(a && a.at || id);
    if (!a || !av) return;
    if (addToLog) lastSaid[id] = text;
    root.querySelectorAll('.av .tag-bubble').forEach(b => { b.hidden = true; });
    root.querySelectorAll('.av.is-talking,.av.has-bubble').forEach(x => x.classList.remove('is-talking', 'has-bubble'));
    av.classList.add('is-talking', 'has-bubble');
    if (status) setStatus(a.at || id, status);
    const bubble = av.querySelector('.tag-bubble');
    bubble.hidden = false;
    bubble.textContent = '';
    const label = document.createElement('b'); label.textContent = `${a.name} · ${a.role}`;
    const span = document.createElement('span');
    bubble.append(label, span);
    clearInterval(typing);
    const done = () => setTimeout(() => av.classList.remove('is-talking'), 300);
    if (calm) { span.textContent = text; done(); }
    else {
      let i = 0;
      typing = setInterval(() => { span.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(typing); done(); } }, 22);
    }
    speak(text, id);
    if (addToLog) {
      const li = document.createElement('li');
      const b = document.createElement('b'); b.textContent = `${a.name} · ${a.role}`;
      li.append(b, document.createTextNode(text));
      log.prepend(li);
      while (log.children.length > 6) log.lastElementChild.remove();
    }
  }
  const ids = Object.keys(AGENTS);
  function speak(text, id) {
    if (!voices || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const list = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    const i = ids.indexOf(id);
    if (list.length) u.voice = list[i % list.length];
    u.rate = 1.04; u.pitch = 0.85 + (i % 5) * 0.08;
    speechSynthesis.speak(u);
  }

  /* ---------- The run ---------- */
  let holder = null;
  function setState(step) {
    offices.forEach(o => {
      const n = Number(o.dataset.step);
      o.classList.toggle('is-active', n === step);
      o.classList.toggle('is-waiting', n === step + 1);
      o.classList.toggle('is-done', n > 0 && n < step);
    });
    items.forEach((li, i) => { li.classList.toggle('is-active', i + 1 === step); li.classList.toggle('is-done', i + 1 < step); });
    root.querySelectorAll('.av').forEach(a => a.classList.toggle('is-working', Number(a.dataset.step) === step));
  }
  const actor = id => AGENTS[id].at || id;
  async function loop() {
    let prev = null;
    for (;;) {
      const lines = linesFor(run);
      for (let i = 0; i < lines.length; i++) {
        const [step, id, status, text] = lines[i];
        const who = actor(id);
        await ensureHome(who);
        if (prev && prev.step !== step && prev.who !== who) {
          await toVisit(prev.who, who);
          say(prev.who, `${AGENTS[who].name}, ${HANDOFF[prev.step].charAt(0).toLowerCase()}${HANDOFF[prev.step].slice(1)}`);
          await wait(2200);
          holder = who;
          const gone = prev.who;
          homeWait[gone] = breakTime(gone).then(() => { delete homeWait[gone]; });
        }
        if (!holder) holder = who;
        setState(step);
        say(id, text, { status });
        await wait(Math.max(2800, text.length * 26 + 1600) + (voices ? 1400 : 0));
        prev = { step, who };
      }
      // Max hands the report to Ava, and the next client starts.
      const first = actor(linesFor((run + 1) % RUNS.length)[0][1]);
      if (prev.who !== first) {
        await toVisit(prev.who, first);
        say(prev.who, `${AGENTS[first].name}, ${HANDOFF[11].charAt(0).toLowerCase()}${HANDOFF[11].slice(1)}`);
        await wait(2200);
        const gone = prev.who;
        homeWait[gone] = breakTime(gone).then(() => { delete homeWait[gone]; });
      }
      holder = first;
      prev = null;
      run = (run + 1) % RUNS.length;
      client.textContent = `Client: ${RUNS[run].client}`;
      now.textContent = RUNS[run].piece;
      await wait(1200);
    }
  }

  /* ---------- Agent card ---------- */
  const face = card.querySelector('.hq-card-face');
  const chat = card.querySelector('.hq-card-chat');
  function select(id) {
    const a = AGENTS[id], av = avEl(id);
    if (!a || !av) return;
    if (a.mode && a.mode !== mode) setMode(a.mode);
    selected = id;
    root.querySelectorAll('.av.is-selected').forEach(x => x.classList.remove('is-selected'));
    av.classList.add('is-selected');
    face.replaceChildren(av.querySelector('.av-fig').cloneNode(true));
    face.style.cssText = av.style.cssText.replace(/left:[^;]+;|top:[^;]+;/g, '');
    card.querySelector('.hq-card-step').textContent = a.step ? `Step ${String(a.step).padStart(2, '0')}` : 'Team lead';
    card.querySelector('#hq-card-name').textContent = a.name;
    card.querySelector('.hq-card-role').textContent = a.role;
    card.querySelector('.hq-card-about').textContent = a.about;
    const list = card.querySelector('.hq-card-skills');
    list.replaceChildren(...(a.skills.length ? a.skills : ['No skills needed, just your OK']).map(k => {
      const li = document.createElement('li');
      li.textContent = a.skills.length ? `/${k.split(':').pop()}` : k;
      if (a.skills.length) li.title = k;
      return li;
    }));
    chat.replaceChildren();
    card.hidden = false;
    focusOn(av);
    if (innerWidth <= 760) setTimeout(() => card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 350);
    reply(a.hi, id);
  }
  function reply(text, id, question) {
    if (question) { const q = document.createElement('p'); q.className = 'q'; q.textContent = question; chat.append(q); }
    const p = document.createElement('p'); p.className = 'a'; p.textContent = text; chat.append(p);
    while (chat.children.length > 6) chat.firstElementChild.remove();
    say(id, text, { log: false });
    card.scrollTop = card.scrollHeight;
  }
  card.querySelector('.hq-card-asks').addEventListener('click', e => {
    const b = e.target.closest('[data-ask]'); if (!b || !selected) return;
    const a = AGENTS[selected];
    const ask = b.dataset.ask;
    const tipN = (a.tipN = ((a.tipN ?? -1) + 1) % a.tips.length);
    const text = ask === 'tip' ? a.tips[tipN]
      : ask === 'skills' ? a.how
      : ask === 'hi' ? a.hi
      : lastSaid[selected] ? `Last thing I did: ${lastSaid[selected]}` : `${a.about} I’m waiting for the work to reach my office.`;
    reply(text, selected, b.textContent);
  });
  function closeCard() {
    if (!selected) return;
    avEl(selected)?.classList.remove('is-selected');
    selected = null; card.hidden = true;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    setCam({ ...HOME });
  }
  card.querySelector('.hq-card-x').addEventListener('click', closeCard);
  root.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });
  root.querySelectorAll('.st-btn').forEach(b => b.addEventListener('click', () => {
    const n = Number(b.dataset.step);
    const first = Object.keys(AGENTS).find(k => AGENTS[k].step === n && (!AGENTS[k].mode || AGENTS[k].mode === mode) && !AGENTS[k].at);
    if (first) select(first);
  }));

  /* ---------- Production mode ---------- */
  const modeBtns = [...root.querySelectorAll('[data-mode]')];
  const PROD = { shoot: ['Human', 'Shoot on site with a photo and video crew'], gen: ['AI', 'Generate images and video with AI'], reuse: ['AI', 'Reuse and re-cut your best old creatives'] };
  function setMode(m) {
    mode = m;
    panel.dataset.mode = m;
    modeBtns.forEach(b => b.setAttribute('aria-checked', String(b.dataset.mode === m)));
    const li = items[5];
    const o = li.querySelector('.st-o');
    o.textContent = PROD[m][0];
    o.className = `st-o st-${PROD[m][0].toLowerCase()}`;
    li.querySelector('small').textContent = PROD[m][1];
  }
  modeBtns.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  setMode('shoot');

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.textContent = paused ? 'Play' : 'Pause';
    panel.classList.toggle('hq-paused', paused);
    if (paused && 'speechSynthesis' in window) speechSynthesis.cancel();
  });
  if (!('speechSynthesis' in window)) voiceBtn.hidden = true;
  voiceBtn.addEventListener('click', () => {
    voices = !voices;
    voiceBtn.setAttribute('aria-pressed', String(voices));
    voiceBtn.textContent = voices ? 'Voices on' : 'Turn on voices';
    if (!voices) speechSynthesis.cancel();
  });

  setState(0);
  if (calm) { pauseBtn.hidden = true; panel.classList.add('hq-paused'); const [st, id, status, text] = linesFor(0)[0]; setState(st); say(id, text, { status }); return; }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.15 }).observe(root);
  requestAnimationFrame(t => { last = t; requestAnimationFrame(frame); });
  loop();
})();
