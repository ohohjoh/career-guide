from pathlib import Path

WEEKS = [
    ("신청 접수", ["일요일 신청을 마감합니다.", "담당자가 취합 후 인사운영부에 인사기록을 요청합니다."]),
    ("인사기록 반영본 발송 <span class=\"arrow\">→ 신청자</span>", ["인사기록으로 근무경력을 채운 HWPX 파일을 신청자에게 보냅니다."]),
    ("참여사업명(업무내역) 회신", ["신청자가 작성해 회신합니다.", "부서에서 진행한 참여사업 및 업무 등을 작성해서 회신합니다."]),
    ("검토, 직인, 송부", ["인프라기획부 담당자 검토, 인사운영부 확인, 총무부 직인을 거쳐 경력확인서를 메일로 송부합니다."]),
]
PRECHECK = [
    ("다음 접수 마감", '<strong id="next-deadline"></strong>'),
    ("발급 예정", '<span id="next-issue"></span>'),
    ("대상 아님", "경력증명서가 필요한 경우 문의 이지현(1411)"),
    ("신청 제한", "같은 협회는 1년에 1회.<br>최근 발급일부터 1년 안에는 기존 발급본을 사용합니다.<br>여러 협회는 한 번에 신청합니다."),
    ("접수 방법", "KOBIS 메일 및 웹메일(ooo@kbs.co.kr)만 받습니다."),
]
CHECKS = [
    "제출 협회, 용도, 협회 제출 기한을 정했고 신청 제한에 해당하지 않음",
    "협회 경력확인서 양식을 <strong>HWPX</strong>로 저장하고 인적사항만 기재함. 근무경력 표는 비워 둠",
    "공사감독을 넣는 경우, 사업부서(송신시설부, 제작시설부, 시설구축부 등) 근무기간은 사업명을, 그 외 부서는 <strong>KOBIS 문서번호</strong>까지 정리함",
    "근무기간, 부서, 직위, 담당업무는 인사기록 기준으로 작성되며 바꿀 수 없음",
]
ASSOC = [("한국정보통신공사협회", "https://www.kica.or.kr/"), ("한국전기공사협회", "https://www.keca.or.kr/"),
         ("한국기술사회", "https://www.kpea.or.kr/"), ("한국엔지니어링협회", "http://www.kenca.or.kr/main/index.jsp"),
         ("한국건설기술인협회", "https://homenet.kocea.or.kr:1443/kocea/koc-kr/index.do"), ("대한기계설비건설협회", "https://www.kmcca.or.kr/main.do"),
         ("한국인터넷진흥원 (ISMS-P)", "https://www.kisa.or.kr/"), ("한국산업기술진흥협회", "https://www.koita.or.kr/")]
OK_MAINT = ["관악산송신소 TV·FM 송신시설 운영 및 유지관리", "주조정실 방송장비 점검 및 운용", "라디오 주조정실 송출 운행 및 장비 관리",
            "제작편집실 디지털 편집장비 유지보수", "중계소 송신설비 정기점검 및 장애 복구", "TV 중계차 장비 운용 및 정비",
            "간이TVR 중계기 순회 점검", "스튜디오 조명·음향 설비 유지관리"]
NG_MAINT = [("UHD 송신시설 구축", "구축"), ("송신기 교체공사 감독", "공사, 감독"), ("원격제어 시스템 설계", "설계"),
            ("방송시설 유지관리 및 공사감독", "감독"), ("주조정실 이전공사 시공", "공사, 시공"), ("디지털 전환 사업 감리", "감리")]
OK_WORK = ["○○송신소 UHD 송신시설 구축공사 (6.2억)", "노후 FM 송신기 11식 교체공사 (5.2억)", "제작편집실 3·C 디지털화 공사 (1.1억)",
           "○○중계소 송신설비 교체공사 <small>(금액 없이도 됨)</small>", "전주총국 신사옥 TV 시설공사"]
NG_WORK = [("방송시설 유지관리", "사업명 아님"), ("송신소 업무 전반", "사업명 아님"), ("각종 시설공사 감독", "사업 불명확"), ("신청 메일에 없던 사업", "추가 불가")]
DESIGN_NOTE = "설계의 경우 기 신청자 중 공사감독 경력이 있고 관련 설계 경력이 있는 경우에 한합니다."
CRITERIA = [
    ("유지관리", "방송시설 유지보수, 점검, 방송 운용·운행 업무", True),
    ("공사감독 (사업부서)", "송신시설부, 제작시설부, 시설구축부 등 사업부서 근무기간의 공사", True),
    ("공사감독 (그 외 부서)", "KOBIS 상신 문서로 확인되는 사업만", True),
    ("설계", DESIGN_NOTE, True),
    ("인정 안 함", "노동조합·감사·공통직군 부서 근무, 입사 연수 기간, 휴직 기간, 내부 지정 감리, 사업부서 외 부서의 KOBIS 문서 없는 공사감독", False),
]
NOTES = ["지역 근무는 유지관리만 인정합니다. 본인이 기안한 KOBIS 사업시행 문서가 있는 사업은 예외입니다.",
         "전기 경력은 전력운영부 확인이 필요하며 송신소 근무만 인정합니다.",
         "부서명은 인사기록의 공식 명칭을 씁니다. 공식 직제에 없는 근무지는 인정하지 않습니다.",
         "직급은 사내 기준(직원, 차장급, 부장급, 보직명)으로 쓰며 재직·퇴직 여부에 따라 달라집니다. 변경 요청은 받지 않습니다.",
         "퇴직 후 재고용 기간은 '사원'으로 쓰고 재계약마다 기간을 나눕니다.",
         "대한기계설비건설협회 양식은 송신소·중계소 주소를 정확히 적어야 합니다."]
FAQ = [("급하게 필요합니다.", "급행은 없습니다. 마감한 달 넷째 주에 발급되므로 협회 제출 기한이 그 이후일 때 신청합니다."),
       ("1년 안에 같은 협회에 다시 내야 합니다.", "재신청할 수 없습니다. 기존 발급본을 사용합니다."),
       ("근무경력 표를 직접 써서 보내도 됩니까?", "안 됩니다. 근무경력은 인사기록으로 작성하고, 신청자는 참여사업명만 씁니다."),
       ("부장(팀장) 보직을 했는데 차장급으로 나옵니다.", "보직이 끝난 뒤 기간은 직급, 보직 경력, 근무지, 재직·퇴직 여부에 따라 사내 기준으로 씁니다. 지역에서 부장 보직 후 퇴직했다면 차장급입니다."),
       ("방송 운용·운행 업무도 인정됩니까?", "인정합니다. 담당업무는 유지관리로 쓰고 참여사업명에 실제로 한 일을 씁니다."),
       ("사업부서가 아닌 곳에서 한 공사감독은요?", "KOBIS 상신 문서가 있는 사업만 인정합니다. 신청 메일에 문서번호를 적습니다."),
       ("경력이 입사일부터 시작하지 않습니다.", "입사 연수 기간은 빠집니다. 첫 근무지 발령일부터 씁니다."),
       ("hwp나 PDF로 보내도 됩니까?", "안 됩니다. 한글에서 다른 이름으로 저장할 때 파일 형식을 HWPX로 고릅니다.")]
EXAMPLE = [
    ("2012.03.01. ~ 2015.02.28.", "○○방송국 기술부", "직원", "유지관리", "○○송신소 TV·FM 송신시설 운영 및 유지관리"),
    ("2015.03.01. ~ 2019.12.31.", "기술본부 제작시설부", "차장급", "공사감독", "○○송신소 UHD 송신시설 구축공사 (6.2억)<br>노후 FM 송신기 교체공사"),
    ("2020.01.01. ~ 2023.06.30.", "기술본부 방송네트워크국 ○○송신소", "팀장", "유지관리", "송신설비 정기점검 및 장애 복구"),
    ("2023.07.01. ~ 현재", "방송인프라본부 송신플랫폼국 ○○송신소", "차장급", "유지관리", "TV·FM 송신시설 운영 및 유지관리"),
]
ASSOC_OPTS = "".join(f"<option>{a}</option>" for a in ["한국정보통신공사협회", "한국전기공사협회", "한국전기기술인협회", "한국기술사회", "한국엔지니어링협회",
                                                        "한국건설기술인협회", "대한기계설비건설협회", "한국인터넷진흥원(ISMS-P)", "한국산업기술진흥협회", "기타"])
GUIDE = [("schedule", "일정"), ("before", "신청 전 확인"), ("prepare", "준비물"), ("mail", "신청 메일")]


def ex_list(items, ng=False):
    if ng:
        return '<ul class="ex ex-no">' + "".join(f'<li><span>{t}</span><em>{w}</em></li>' for t, w in items) + "</ul>"
    return '<ul class="ex ex-ok">' + "".join(f"<li>{t}</li>" for t in items) + "</ul>"


def next_btn(i):
    if i >= len(GUIDE) - 1:
        return ""
    nid, name = GUIDE[i + 1]
    return f'<div class="next-wrap"><a href="#{nid}" class="next-step" data-guide-next="{nid}">다음 단계: {name}</a></div>'


tiles = "".join(f'''<article class="tile" data-week="{i+1}" style="--d:{i}">
        <p class="t-no">{i+1}주</p><p class="t-date wk-date"></p><h3>{t}</h3><p class="t-desc">{"<br>".join(d)}</p>
        <p class="t-badge">이번 주</p></article>''' for i, (t, d) in enumerate(WEEKS))
pre = "".join(f'<div class="spec-row"><dt>{k}</dt><dd>{v}</dd></div>' for k, v in PRECHECK)
crit = "".join(f'<div class="spec-row{"" if ok else " neg"}"><dt>{k}</dt><dd>{v}</dd></div>' for k, v, ok in CRITERIA)
checks = '<ul class="checks">' + "".join(
    f'<li><label><input type="checkbox" class="pre"><span class="box" aria-hidden="true"></span><span class="txt">{c}</span></label></li>' for c in CHECKS) + "</ul>"
assoc = '<details class="assoc"><summary>협회 홈페이지</summary><ul>' + "".join(
    f'<li><a href="{u}" target="_blank" rel="noopener">{n}</a></li>' for n, u in ASSOC) + "</ul></details>"
faq = '<div class="faq">' + "".join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in FAQ) + "</div>"
example = "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td class=\"mine\">{e}</td></tr>" for a, b, c, d, e in EXAMPLE)
guidebar = "".join(f'<li data-guide="{gid}"><span class="g-no">{i+1}</span>{name}</li>' for i, (gid, name) in enumerate(GUIDE))

html = f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>경력확인서 발급 가이드</title>
<meta property="og:title" content="경력확인서 발급 가이드">
<meta property="og:description" content="매월 첫째 주 일요일 접수 마감, 넷째 주 PDF 발급. KBS 인프라기획부">
<meta property="og:url" content="https://ohohjoh.github.io/career-guide/">
<meta property="og:image" content="https://ohohjoh.github.io/career-guide/static/preview.png">
<meta property="og:site_name" content="KBS 인프라기획부">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="./style.css">
</head>
<body>
<nav class="localnav" aria-label="페이지 메뉴">
  <div class="ln-row">
    <a href="#top" class="ln-title" data-hyper-hover>경력확인서</a>
    <div class="ln-dates">
      <p class="ln-date" id="chip-cur"><span id="cur-label"></span><b id="cur-date"></b><em id="cur-state" hidden></em></p>
      <p class="ln-date" id="chip-nxt"><span id="nxt-label"></span><b id="nxt-date"></b></p>
    </div>
    <div class="ln-links spy">
      <a href="#schedule">일정</a><a href="#before">신청 전 확인</a><a href="#prepare">준비물</a><a href="#mail">신청 메일</a>
      <a href="#write">참여사업명</a><a href="#criteria">인정 기준</a><a href="#faq">질문</a><a href="#example">예시</a>
    </div>
    <button type="button" class="ln-menu" id="ln-menu" aria-expanded="false" aria-controls="ln-sheet"><span class="bars" aria-hidden="true"></span><span class="sr">메뉴</span></button>
  </div>
  <div class="ln-sheet" id="ln-sheet" hidden>
    <a href="#schedule">일정</a><a href="#before">신청 전 확인</a><a href="#prepare">준비물</a><a href="#mail">신청 메일</a>
    <a href="#write">참여사업명 작성</a><a href="#criteria">인정 기준</a><a href="#faq">자주 묻는 질문</a><a href="#example">작성 예시</a>
  </div>
</nav>

<header class="hero" id="top">
  <p class="hero-org">KBS 인프라기획부</p>
  <h1><span data-hyper>경력확인서 발급 가이드</span></h1>
  <p class="hero-sub">매월 첫째 주 일요일까지 접수를 마감하고, 마지막 주(넷째 주)에 PDF로 드립니다.<br><strong>일정 및 신청 방법을 반드시 숙지하고 신청 바랍니다.</strong></p>
  <figure class="film">
    <video id="film" autoplay muted loop playsinline preload="auto" poster="./static/flow_poster.jpg" aria-label="경력확인서 한 달의 흐름: 1주 신청 접수, 2주 인사기록 반영본 발송, 3주 참여사업명 회신, 4주 검토와 직인 후 송부">
      <source src="./static/flow.webm" type="video/webm">
      <source src="./static/flow.mp4" type="video/mp4">
    </video>
    <button type="button" class="film-toggle" id="film-toggle" aria-label="영상 일시정지"><span class="i-pause" aria-hidden="true"></span></button>
  </figure>
  <div class="guide-cta">
    <svg class="hand" viewBox="0 0 24 24" aria-hidden="true">
      <circle class="ripple" cx="16" cy="22.4" r="2"/>
      <g class="hand-shape" transform="rotate(180 12 12)">
        <path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/>
        <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
      </g>
    </svg>
    <a href="#schedule" class="btn-guide" id="guide-start">순서대로 진행하기</a>
  </div>
  <p class="guide-hint">일정, 신청 전 확인, 준비물, 신청 메일 순서로 안내합니다.</p>
</header>

<section class="band band-gray" id="schedule">
  <div class="inner">
    <div class="sec-head"><h2 id="month-title" data-hyper-view>이번 달 일정</h2><p id="month-now" class="now-pill"></p></div>
    <div class="bento" data-reveal>{tiles}</div>
    {next_btn(0)}
  </div>
</section>

<section class="band" id="before">
  <div class="inner narrow">
    <h2>신청 전 확인</h2>
    <dl class="spec">{pre}</dl>
    {next_btn(1)}
  </div>
</section>

<section class="band band-gray" id="prepare">
  <div class="inner narrow">
    <h2>준비물</h2>
    <p class="sec-sub">네 항목을 모두 확인하면 신청 메일 양식이 열립니다.</p>
    {checks}
    {assoc}
    {next_btn(2)}
  </div>
</section>

<section class="band" id="mail">
  <div class="inner narrow">
    <h2>신청 메일</h2>
    <p class="sec-sub">칸을 채우면 제목과 본문이 만들어집니다. KOBIS 메일 또는 웹메일로 보냅니다.</p>
    <div class="panel-white">
      <p id="mail-locked" class="locked">준비물 네 항목을 모두 확인하면 열립니다. <strong id="check-count">0</strong>/4</p>
      <div id="mail-builder" hidden>
        <div class="fields">
          <label>성명<input id="f-name" type="text" autocomplete="off"></label>
          <label>사번<input id="f-empno" type="text" inputmode="numeric" autocomplete="off"></label>
          <label>재직 구분<select id="f-status"><option>재직</option><option>퇴직</option><option>재고용(연봉직)</option></select></label>
          <label>제출 협회<select id="f-assoc">{ASSOC_OPTS}</select></label>
          <label>용도<input id="f-purpose" type="text" placeholder="정보통신기술자 등급 상향"></label>
          <label>협회 제출 기한<input id="f-due" type="date"></label>
          <label class="wide">공사감독<select id="f-works"><option value="no">없음</option><option value="yes">있음</option></select></label>
          <label class="wide" id="works-wrap" hidden>공사감독 사업<small>한 줄에 한 건. 기간 / 사업명 / 금액(없으면 생략) / KOBIS 문서번호(사업부서 외 필수)</small>
            <textarea id="f-worklist" rows="4" placeholder="2023.03.~2023.11. / ○○송신소 UHD 송신시설 구축공사 / 6.2억 / 송신플랫폼국-2023-000123"></textarea></label>
        </div>
        <div class="mailout">
          <div class="mo-row"><span class="mo-k">받는 사람</span><span id="out-to" class="mo-v"></span></div>
          <div class="mo-row"><span class="mo-k">제목</span><span id="out-subject" class="mo-v"></span><button type="button" class="copy" data-copy="out-subject">복사</button></div>
          <div class="mo-row mo-body"><span class="mo-k">본문</span><pre id="out-body" class="mo-v"></pre><button type="button" class="copy" data-copy="out-body">복사</button></div>
          <div class="mo-row"><span class="mo-k">첨부</span><span class="mo-v">협회 경력확인서 양식 (HWPX, 인적사항만 기재)</span></div>
        </div>
        <p id="form-warn" class="warn" hidden></p>
        <p class="fine">본문은 고치지 말고 그대로 보냅니다. 입력한 내용은 이 화면에서만 쓰이며 저장되지 않습니다.</p>
      </div>
    </div>
    <div class="next-wrap done-wrap" id="guide-done" hidden><p>신청 메일을 보내면 신청이 끝납니다. 둘째 주에 인사기록 반영본을 받으면 아래 <a href="#write">참여사업명 작성</a>을 참고해 회신합니다.</p></div>
  </div>
</section>

<section class="band band-gray" id="write">
  <div class="inner">
    <div class="sec-head"><h2>참여사업명 &amp; 업무기록 작성</h2>
      <p class="sec-sub">둘째 주에 받은 인사기록 반영본(HWPX)에서 <strong>'참여사업명' 칸만</strong> 채워 셋째 주 안에 회신합니다.<br>근무기간, 부서, 직위, 담당업무 칸을 고치면 반려합니다. 작성 예시는 <a href="#example">맨 아래</a>에 있습니다.</p></div>
    <div class="duo">
      <article class="tile tall"><h3>유지관리</h3><p class="t-desc">담당 시설과 한 일을 씁니다.<br>운영, 운용, 운행, 점검, 유지보수 모두 씁니다.<br><span class="no">구축, 감독, 설계, 공사, 시공, 감리는 쓰지 않습니다.</span></p>{ex_list(OK_MAINT)}<p class="ex-head">반려되는 예</p>{ex_list(NG_MAINT, True)}</article>
      <article class="tile tall"><h3>공사감독</h3><p class="t-desc">참여한 사업명을 씁니다. 금액은 알면 함께 씁니다.<br>신청 메일에 적은 사업만 씁니다.</p>{ex_list(OK_WORK)}<p class="ex-head">반려되는 예</p>{ex_list(NG_WORK, True)}<p class="design-note">{DESIGN_NOTE}</p></article>
    </div>
  </div>
</section>

<section class="band" id="criteria">
  <div class="inner narrow">
    <h2>인정 기준</h2>
    <p class="sec-sub">근무기간, 부서, 직위, 담당업무는 인사기록(발령사항)을 기준으로 담당자가 작성합니다.</p>
    <dl class="spec">{crit}</dl>
    <ul class="notes">{"".join(f"<li>{n}</li>" for n in NOTES)}</ul>
  </div>
</section>

<section class="band band-gray" id="faq">
  <div class="inner narrow"><h2>자주 묻는 질문</h2>{faq}</div>
</section>

<section class="band" id="example">
  <div class="inner">
    <div class="sec-head"><h2>작성 예시</h2><p class="sec-sub">회색 칸은 담당자가 인사기록으로 채워 보냅니다. <strong class="mine-label">파란 칸</strong>만 신청자가 씁니다.</p></div>
    <div class="ex-table-wrap">
      <table class="ex-table">
        <thead><tr><th>근무기간</th><th>근무부서</th><th>직위</th><th>담당업무</th><th class="mine">참여사업명</th></tr></thead>
        <tbody>{example}</tbody>
      </table>
    </div>
    <p class="fine">예시의 부서와 사업은 실제와 관계없습니다.</p>
  </div>
</section>

<footer class="foot"><div class="inner narrow">
  <p>KBS 인프라기획부 경력확인서 담당 오종원. 접수와 문의는 KOBIS 메일 및 웹메일(ooo@kbs.co.kr)로 받습니다.</p>
  <p>경력증명서는 인사운영부 이지현(1411)</p>
</div></footer>

<div class="guidebar" id="guidebar" hidden>
  <ol>{guidebar}</ol>
  <button type="button" class="guide-next" id="guide-next">다음 단계</button>
</div>
<script src="./script.js"></script>
</body>
</html>
'''
Path(__file__).with_name("index.html").write_text(html, encoding="utf-8")
print("ok")
