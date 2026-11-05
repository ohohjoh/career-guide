// ───── 운영 설정 ─────
const CONFIG = {
  deadlineWeekday: 3,        // 첫째 주를 정하는 기준 요일(수). 마감은 그 주 일요일
  deadlineWeekOfMonth: 1,    // 매월 몇째 주
  to: 'KOBIS 메일 또는 웹메일(ooo@kbs.co.kr), 인프라기획부 오종원',
};

const DAY = 864e5;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
function deadlineOf(year, month) {           // month: 0~11 (넘치면 다음 해)
  const first = new Date(year, month, 1);
  const shift = (CONFIG.deadlineWeekday - first.getDay() + 7) % 7;
  // 첫째 주 = 그달 첫 수요일이 든 주(월~일). 마감은 그 주 일요일
  return new Date(first.getFullYear(), first.getMonth(), 1 + shift + 7 * (CONFIG.deadlineWeekOfMonth - 1) + 4);
}
function nextDeadline(today) {
  let d = deadlineOf(today.getFullYear(), today.getMonth());
  if (d < today) d = deadlineOf(today.getFullYear(), today.getMonth() + 1);
  return d;
}
// 한 달 주기: 마감이 든 주의 월요일부터 4주
function cycleOf(deadline) {
  const mon = addDays(deadline, -((deadline.getDay() + 6) % 7));
  return { deadline, weeks: [0, 1, 2, 3].map(i => ({ mon: addDays(mon, 7 * i), fri: addDays(mon, 7 * i + 6) })) };
}
const ymd = d => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}.(${'일월화수목금토'[d.getDay()]})`;
const md = d => `${d.getMonth() + 1}.${d.getDate()}.`;

document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 지금 진행 중인 주기 (없으면 다음 주기)
  let cyc = cycleOf(deadlineOf(today.getFullYear(), today.getMonth()));
  if (today < cyc.weeks[0].mon) cyc = cycleOf(deadlineOf(today.getFullYear(), today.getMonth() - 1));
  let idx = Math.floor((today - cyc.weeks[0].mon) / DAY / 7) + 1;
  if (idx > 4) { cyc = cycleOf(nextDeadline(today)); idx = 0; }
  const m = cyc.deadline;
  $('month-title').textContent = `${m.getFullYear()}년 ${m.getMonth() + 1}월 일정`;
  document.querySelectorAll('[data-week]').forEach(el => {
    const i = +el.dataset.week - 1, w = cyc.weeks[i];
    const d = el.querySelector('.wk-date'); if (d) d.textContent = `${md(w.mon)} ~ ${md(w.fri)}`;
    el.classList.toggle('now', i + 1 === idx);
    el.classList.toggle('past', idx > 0 && i + 1 < idx);
  });
  // 시안별 연출용: 현재 주차를 문서에 표시 (0 = 진행 중인 주기 없음)
  const root = document.documentElement;
  root.dataset.week = idx; root.style.setProperty('--now', idx);
  // B안: 평일 달력
  const cal = document.getElementById('cal');
  if (cal) {
    const names = ['접수', '작성본 발송', '참여사업명 회신', '확인·직인·발급'];
    cal.innerHTML = cyc.weeks.map((w, i) => {
      const days = [0, 1, 2, 3, 4].map(k => {
        const day = addDays(w.mon, k), t = +day === +today;
        const mark = (i === 0 && k === (CONFIG.deadlineWeekday + 6) % 7) ? '<i>마감</i>' : (i === 3 && k === 4) ? '<i>발급</i>' : '';
        return `<span class="day${t ? ' today' : ''}" style="--k:${k}"><b>${day.getDate()}</b>${mark}</span>`;
      }).join('');
      return `<div class="cal-week p${i + 1}${i + 1 === idx ? ' now' : ''}" style="--i:${i}"><span class="cal-name">${i + 1}주<small>${names[i]}</small></span>${days}</div>`;
    }).join('');
  }
  // 마감까지 남은 날, 긴 날짜 표기
  const nd0 = nextDeadline(today), nc0 = cycleOf(nd0);
  const left = Math.round((nd0 - today) / DAY);
  document.querySelectorAll('.dday').forEach(e => (e.textContent = left === 0 ? '오늘 마감' : `${left}일`));
  document.querySelectorAll('.deadline-long').forEach(e => (e.textContent = `${nd0.getMonth() + 1}월 ${nd0.getDate()}일 ${'일월화수목금토'[nd0.getDay()]}요일`));
  document.querySelectorAll('.issue-long').forEach(e => (e.textContent = `${nc0.weeks[3].mon.getMonth() + 1}월 넷째 주`));

  // 스크롤에 맞춰 한 번 나타나기 ([data-reveal])
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.2 }) : null;
  document.querySelectorAll('[data-reveal]').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  // 목차 따라가기 (.spy 안의 #링크)
  const spyLinks = [...document.querySelectorAll('.spy a[href^="#"]')];
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(spyLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { spyLinks.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); }
    }), { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((a, id) => { const t = document.getElementById(id); if (t) so.observe(t); });
  }

  // 전환 버튼 ([data-seg] → [data-seg-panel])
  document.querySelectorAll('[data-seg]').forEach(btn => btn.addEventListener('click', () => {
    const g = btn.closest('[data-seg-group]');
    g.querySelectorAll('[data-seg]').forEach(b => b.setAttribute('aria-pressed', b === btn));
    g.querySelectorAll('[data-seg-panel]').forEach(p => (p.hidden = p.dataset.segPanel !== btn.dataset.seg));
  }));

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
  const NOW_TEXT = ['', '접수 마감 주간입니다.', '작성본 발송 주간입니다.', '참여사업명 회신 주간입니다.', '확인과 직인 주간입니다.'];
  $('month-now').textContent = idx ? `지금은 ${idx}주차, ${NOW_TEXT[idx]}` : `다음 접수 마감은 ${ymd(m)}입니다.`;

  const nd = nextDeadline(today), nc = cycleOf(nd);
  $('next-deadline').textContent = ymd(nd);
  $('next-issue').textContent = `${nd.getFullYear()}년 ${nd.getMonth() + 1}월 4주차 (${md(nc.weeks[3].mon)} ~ ${md(nc.weeks[3].fri)})`;
  $('out-to').textContent = CONFIG.to;

  // 탭 (#apply #write #criteria #faq)
  const tabs = document.querySelectorAll('.tab');
  const open = (id, push) => {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === id));
    document.getElementById(id)?.animate?.([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220, easing: 'ease-out' });
    if (push) history.replaceState(null, '', '#' + id);
  };
  tabs.forEach(t => t.addEventListener('click', e => { e.preventDefault(); open(t.dataset.target, true); window.scrollTo({ top: 0 }); }));
  const h = location.hash.slice(1);
  if (h && document.getElementById(h)?.classList.contains('panel')) open(h, false);

  // 준비물 확인 → 메일 양식
  const checks = [...document.querySelectorAll('.pre')];
  const update = () => {
    const n = checks.filter(c => c.checked).length;
    $('check-count').textContent = n;
    document.querySelectorAll('.cta-label').forEach(e => (e.textContent = n === checks.length ? '신청 메일 만들기' : `준비물 확인 ${n}/${checks.length}`));
    const ok = n === checks.length;
    $('mail-locked').hidden = ok; $('mail-builder').hidden = !ok;
    if (ok) render();
  };
  checks.forEach(c => c.addEventListener('change', update));

  // 메일 양식 (담당자 대장 프로그램이 읽는 형식 — 줄 머리 바꾸지 말 것)
  const ids = ['f-name', 'f-empno', 'f-status', 'f-assoc', 'f-purpose', 'f-due', 'f-works', 'f-worklist'];
  ids.forEach(id => $(id).addEventListener('input', render));
  $('f-works').addEventListener('change', () => { $('works-wrap').hidden = $('f-works').value !== 'yes'; render(); });
  function render() {
    const v = Object.fromEntries(ids.map(id => [id, $(id).value.trim()]));
    $('out-subject').textContent = `[경력확인서 신청] ${v['f-empno'] || '사번'} ${v['f-name'] || '성명'} / ${v['f-assoc']}`;
    const works = v['f-works'] === 'yes'
      ? ['공사감독: 있음', ...(v['f-worklist'] || '기간 / 사업명 / 금액 / KOBIS 문서번호').split('\n').filter(Boolean).map(l => '- ' + l.trim())]
      : ['공사감독: 없음'];
    $('out-body').textContent = [
      '[경력확인서 신청]',
      `성명: ${v['f-name']}`,
      `사번: ${v['f-empno']}`,
      `재직 구분: ${v['f-status']}`,
      `제출 협회: ${v['f-assoc']}`,
      `용도: ${v['f-purpose']}`,
      `협회 제출 기한: ${v['f-due']}`,
      ...works,
    ].join('\n');
    const miss = [['f-name', '성명'], ['f-empno', '사번'], ['f-purpose', '용도'], ['f-due', '협회 제출 기한']]
      .filter(([k]) => !v[k]).map(([, n]) => n);
    if (v['f-works'] === 'yes' && !v['f-worklist']) miss.push('공사감독 사업');
    $('form-warn').hidden = !miss.length;
    $('form-warn').textContent = `미입력: ${miss.join(', ')}`;
  }

  // 복사
  document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', async () => {
    const text = $(b.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    const o = b.textContent; b.textContent = '복사됨'; b.classList.add('done');
    setTimeout(() => { b.textContent = o; b.classList.remove('done'); }, 1400);
  }));

  update();
});

// ───── 하이퍼텍스트: 글자가 뒤섞였다가 왼쪽부터 제자리를 찾음 ─────
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const randHangul = () => String.fromCharCode(0xac00 + Math.floor(Math.random() * 11172));
  const randFor = ch => /\s|[.,()~·]/.test(ch) ? ch : /\d/.test(ch) ? String(Math.floor(Math.random() * 10)) : /[A-Za-z]/.test(ch) ? 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)] : randHangul();
  function hyper(el, ms = 900) {
    if (reduce || el.dataset.busy) return;
    const final = el.dataset.final || el.textContent;
    el.dataset.final = final; el.dataset.busy = '1';
    el.style.minWidth = el.offsetWidth ? `${el.offsetWidth}px` : '';
    const chars = [...final], t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / ms), fixed = Math.floor(k * chars.length);
      el.textContent = chars.map((c, i) => (i < fixed ? c : randFor(c))).join('');
      if (k < 1) requestAnimationFrame(tick);
      else { el.textContent = final; delete el.dataset.busy; el.style.minWidth = ''; }
    };
    requestAnimationFrame(tick);
  }
  window.addEventListener('load', () => {
    document.querySelectorAll('[data-hyper]').forEach((el, i) => setTimeout(() => hyper(el, 800), 150 + i * 220));
    const vo = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { hyper(e.target, 900); vo.unobserve(e.target); }
    }), { threshold: 0.6 });
    document.querySelectorAll('[data-hyper-view]').forEach(el => vo ? vo.observe(el) : null);
    document.querySelectorAll('[data-hyper-hover]').forEach(el => el.addEventListener('mouseenter', () => hyper(el, 500)));
  });

  // ───── 첫 화면 영상: 동작 줄이기 설정이면 정지 화면, 버튼으로 재생/정지 ─────
  const v = document.getElementById('film'), b = document.getElementById('film-toggle');
  if (!v || !b) return;
  const sync = () => { const paused = v.paused; b.setAttribute('aria-label', paused ? '영상 재생' : '영상 일시정지'); b.firstElementChild.className = paused ? 'i-play' : 'i-pause'; };
  if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
  b.addEventListener('click', () => { v.paused ? v.play() : v.pause(); });
  v.addEventListener('play', sync); v.addEventListener('pause', sync); sync();
})();

// ───── 상단 날짜 칩: 이번 달 마감(접수중/마감), 다음 달 마감 ─────
(() => {
  const $ = id => document.getElementById(id);
  if (!$('cur-date')) return;
  const n = new Date(), today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const cur = deadlineOf(today.getFullYear(), today.getMonth());
  const nxt = deadlineOf(today.getFullYear(), today.getMonth() + 1);
  const md2 = d => `${d.getMonth() + 1}월 ${d.getDate()}일`;
  const open = today <= cur;
  $('cur-label').textContent = `${cur.getMonth() + 1}월 접수일`;
  $('cur-date').textContent = md2(cur);
  $('cur-state').hidden = open;
  $('cur-state').textContent = '마감';
  $('cur-state').className = 'closed';
  $('nxt-label').textContent = `${nxt.getMonth() + 1}월 마감일`;
  $('nxt-date').textContent = md2(nxt);
  document.getElementById(open ? 'chip-cur' : 'chip-nxt').classList.add('active');
})();

// ───── 순서대로 진행하기: 일정 → 신청 전 확인 → 준비물 → 신청 메일 ─────
(() => {
  const steps = ['schedule', 'before', 'prepare', 'mail'];
  const bar = document.getElementById('guidebar'), btn = document.getElementById('guide-next');
  if (!bar || !btn) return;
  let cur = -1, active = false;
  const items = [...bar.querySelectorAll('li')];
  const checks = [...document.querySelectorAll('.pre')];
  const go = i => { document.getElementById(steps[i])?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  function render() {
    items.forEach((li, k) => { li.classList.toggle('cur', k === cur); li.classList.toggle('done', k < cur); });
    const allChecked = checks.every(c => c.checked);
    if (cur === 2 && !allChecked) { btn.disabled = true; btn.textContent = `준비물 확인 ${checks.filter(c => c.checked).length}/4`; }
    else if (cur >= 3) { btn.disabled = false; btn.textContent = '안내 닫기'; document.getElementById('guide-done').hidden = false; }
    else { btn.disabled = false; btn.textContent = '다음 단계'; }
  }
  function start(i = 0) { active = true; bar.hidden = false; cur = i; render(); go(i); }
  document.getElementById('guide-start')?.addEventListener('click', e => { e.preventDefault(); start(0); });
  document.querySelectorAll('[data-guide-next]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const i = steps.indexOf(a.dataset.guideNext);
    if (i === 3 && !checks.every(c => c.checked)) { start(2); document.querySelector('.checks')?.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
    start(i);
  }));
  btn.addEventListener('click', () => {
    if (cur >= 3) { bar.hidden = true; active = false; return; }
    cur += 1; render(); go(cur);
  });
  checks.forEach(c => c.addEventListener('change', render));
  // 스크롤 위치에 맞춰 현재 단계 표시
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (active && e.isIntersecting) { const i = steps.indexOf(e.target.id); if (i >= 0) { cur = i; render(); } }
    }), { rootMargin: '-40% 0px -50% 0px' });
    steps.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  }
})();

// ───── 모바일 메뉴 ─────
(() => {
  const b = document.getElementById('ln-menu'), sh = document.getElementById('ln-sheet');
  if (!b || !sh) return;
  const set = open => { sh.hidden = !open; b.setAttribute('aria-expanded', open); document.body.classList.toggle('menu-open', open); };
  b.addEventListener('click', () => set(sh.hidden));
  sh.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();
