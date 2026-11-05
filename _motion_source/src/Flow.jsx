import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Easing } from 'remotion';

const C = { bg: '#f5f5f7', white: '#ffffff', ink: '#1d1d1f', ink2: '#6e6e73', ink3: '#86868b', line: '#d2d2d7', blue: '#0071e3', seal: '#d1342b', red: '#e0241b' };
const FONT = 'Pretendard';
const fontCss = ['Regular:400', 'SemiBold:600', 'Bold:700', 'ExtraBold:800'].map(s => {
  const [n, w] = s.split(':');
  return `@font-face{font-family:${FONT};font-weight:${w};src:url(${staticFile(`Pretendard-${n}.woff2`)}) format('woff2');}`;
}).join('');

const STEPS = [
  { wk: '1주', t: '신청 접수', d: '일요일 마감' },
  { wk: '2주', t: '인사기록 반영본 발송', d: '담당자 → 신청자' },
  { wk: '3주', t: '참여사업명 회신', d: '신청자 작성' },
  { wk: '4주', t: '검토, 직인, 송부', d: '인사운영부, 총무부' },
];
const CAPS = [
  '접수부터 발급까지 4주.',
  '첫째 주 일요일, 신청을 마감합니다.',
  '근무경력을 채운 HWPX를 보냅니다.',
  '참여사업명(업무내역)을 써서 회신합니다.',
  '검토와 직인을 거쳐 메일로 보냅니다.',
  '매월 넷째 주, 경력확인서를 받습니다.',
];
const START = 40, SPAN = 62;               // 단계마다 62프레임
const ease = Easing.bezier(0.2, 0.7, 0.2, 1);

const Illo = ({ i, p }) => {               // p: 0~1 단계 안 진행도
  if (i === 0) {                          // 메일이 날아가 들어감
    const y = interpolate(p, [0, 0.55], [26, -6], { extrapolateRight: 'clamp', easing: ease });
    const o = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' });
    return (<div style={{ position: 'relative', width: 120, height: 84, transform: `translateY(${y}px)`, opacity: o }}>
      <div style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 12 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0, borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderTop: '46px solid #e8e8ed' }} />
      <div style={{ position: 'absolute', right: -10, top: -10, width: 30, height: 30, borderRadius: 15, background: C.blue, color: '#fff', font: `700 15px ${FONT}`, display: 'grid', placeItems: 'center',
        transform: `scale(${interpolate(p, [0.45, 0.65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })})` }}>1</div>
    </div>);
  }
  if (i === 1) {                          // 문서에 줄이 차례로 채워짐
    return (<div style={{ width: 96, height: 124, background: '#fff', borderRadius: 10, padding: 14, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 9 }}>
      {[0.9, 0.7, 0.85, 0.6, 0.75].map((w, k) => (
        <div key={k} style={{ height: 7, borderRadius: 4, background: k === 0 ? C.blue : '#d2d2d7',
          width: `${interpolate(p, [0.08 + k * 0.1, 0.3 + k * 0.1], [0, w * 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })}%` }} />))}
    </div>);
  }
  if (i === 2) {                          // 칸에 글자가 입력됨
    const text = '송신시설 운영 및 유지관리';
    const n = Math.floor(interpolate(p, [0.1, 0.75], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    const caret = Math.floor(p * 12) % 2 === 0;
    return (<div style={{ width: 206, background: '#fff', borderRadius: 12, padding: '12px 14px', boxSizing: 'border-box' }}>
      <div style={{ font: `600 12px ${FONT}`, color: C.ink3, marginBottom: 6 }}>참여사업명</div>
      <div style={{ font: `600 15px ${FONT}`, color: C.ink, height: 22, whiteSpace: 'nowrap' }}>{text.slice(0, n)}<span style={{ opacity: caret ? 1 : 0, color: C.blue }}>|</span></div>
    </div>);
  }
  const s = interpolate(p, [0.15, 0.4], [2.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6)) });
  const o = interpolate(p, [0.15, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (<div style={{ position: 'relative', width: 100, height: 128, background: '#fff', borderRadius: 10 }}>
    <div style={{ position: 'absolute', left: 14, top: 14, font: `800 13px ${FONT}`, color: C.ink2 }}>PDF</div>
    <div style={{ position: 'absolute', right: 10, bottom: 12, width: 56, height: 56, borderRadius: 28, border: `3px solid ${C.seal}`, color: C.seal, display: 'grid', placeItems: 'center',
      font: `800 15px ${FONT}`, transform: `rotate(-14deg) scale(${s})`, opacity: o }}>직인</div>
  </div>);
};

export const Flow = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fadeAll = interpolate(frame, [0, 12, durationInFrames - 14, durationInFrames], [0, 1, 1, 0]);
  const titleIn = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const active = Math.min(3, Math.max(-1, Math.floor((frame - START) / SPAN)));
  const endT = interpolate(frame, [START + SPAN * 4, START + SPAN * 4 + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const prog = interpolate(frame, [START, START + SPAN * 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, opacity: fadeAll }}>
      <style>{fontCss}</style>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 56, opacity: titleIn }}>
        <div style={{ font: `600 22px ${FONT}`, color: C.ink2, letterSpacing: '-0.02em' }}>경력확인서 한 달의 흐름</div>
        <div style={{ position: 'relative', height: 72, marginTop: 10 }}>
          {CAPS.map((c, k) => {
            const from = k === 0 ? 0 : k === 5 ? START + SPAN * 4 : START + SPAN * (k - 1);
            const to = k === 0 ? START : k === 5 ? durationInFrames + 30 : START + SPAN * k;
            const inP = k === 0 ? 1 : interpolate(frame, [from, from + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
            const outP = interpolate(frame, [to - 8, to + 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const o = Math.min(inP, 1 - outP);
            if (o <= 0) return null;
            return <div key={k} style={{ position: 'absolute', left: 0, top: 0, font: `800 50px/1.2 ${FONT}`, color: k === 0 ? C.ink : C.red, letterSpacing: '-0.03em',
              opacity: o, transform: `translateY(${(1 - inP) * 18 - outP * 10}px)`, whiteSpace: 'nowrap' }}>{c}</div>;
          })}
        </div>
      </div>
      {/* 진행 막대 */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 236, height: 4, borderRadius: 2, background: '#e3e3e8' }}>
        <div style={{ height: '100%', width: `${prog * 100}%`, borderRadius: 2, background: C.blue }} />
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 268, bottom: 72, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
        {STEPS.map((s, i) => {
          const tIn = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 200 } });
          const on = active === i && endT === 0;
          const onAmt = interpolate(frame, [START + SPAN * i, START + SPAN * i + 10, START + SPAN * (i + 1) - 4, START + SPAN * (i + 1) + 6], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const lit = i === 3 ? Math.max(onAmt, endT) : onAmt;
          const done = active > i || endT > 0;
          const p = interpolate(frame, [START + SPAN * i, START + SPAN * (i + 1)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const bg = `rgb(${Math.round(255 - (255 - 29) * lit)},${Math.round(255 - (255 - 29) * lit)},${Math.round(255 - (255 - 31) * lit)})`;
          const fg = lit > 0.5 ? '#f5f5f7' : C.ink;
          return (
            <div key={i} style={{ position: 'relative', background: bg, borderRadius: 28, padding: '28px 26px', overflow: 'hidden',
              opacity: tIn, transform: `translateY(${(1 - tIn) * 30}px) scale(${1 + lit * 0.03})` }}>
              <div style={{ font: `800 40px/1 ${FONT}`, color: done && lit < 0.5 ? C.ink3 : fg, letterSpacing: '-0.03em' }}>{s.wk}</div>
              <div style={{ font: `700 21px/1.3 ${FONT}`, color: fg, marginTop: 18, letterSpacing: '-0.03em' }}>{s.t}</div>
              <div style={{ font: `400 15px ${FONT}`, color: lit > 0.5 ? '#a1a1a6' : C.ink2, marginTop: 6 }}>{s.d}</div>
              <div style={{ position: 'absolute', left: 26, bottom: 26, opacity: Math.max(lit, i === 3 ? endT : 0) }}>
                {(on || (i === 3 && endT > 0) || lit > 0.05) && <Illo i={i} p={i === 3 && endT > 0 ? 1 : p} />}
              </div>
              {done && lit < 0.5 && (
                <div style={{ position: 'absolute', right: 22, top: 26, width: 26, height: 26, borderRadius: 13, background: C.blue, display: 'grid', placeItems: 'center' }}>
                  <div style={{ width: 6, height: 11, border: 'solid #fff', borderWidth: '0 2.5px 2.5px 0', transform: 'rotate(45deg) translate(-1px,-1px)' }} />
                </div>)}
            </div>);
        })}
      </div>
    </AbsoluteFill>
  );
};
