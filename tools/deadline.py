"""
접수 상태 이미지 생성 (GitHub Actions가 매일 00:01 KST 실행)
  static/deadline.png  : 내 정보 박스에 거는 이미지 (빨간 글씨)
  static/deadline.json : 날짜 데이터
규칙(A안): 매월 1~10일 접수 → 20일 경력 정리표 발송 → 25일 초안 회신 → 말일 일괄 발급
  1~10일  : "11월 10일(화)까지 접수"
  11일~말일: "12월 1일 ~ 10일 접수"
"""
import json, calendar, datetime as dt
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "tools" / "Pretendard-ExtraBold.otf"
WD = "월화수목금토일"


def status(today):
    if today.day <= 10:
        close = today.replace(day=10)
        return {"open": True, "close": close.isoformat(),
                "issue": today.replace(day=calendar.monthrange(today.year, today.month)[1]).isoformat(),
                "label": f"{close.month}월 {close.day}일({WD[close.weekday()]})까지 접수"}
    y, m = (today.year + 1, 1) if today.month == 12 else (today.year, today.month + 1)
    return {"open": False, "next_open": dt.date(y, m, 1).isoformat(), "close": dt.date(y, m, 10).isoformat(),
            "label": f"{m}월 1일 ~ 10일 접수"}


def main():
    today = dt.datetime.now(dt.timezone(dt.timedelta(hours=9))).date()      # 한국 날짜
    st = status(today)
    text = st["label"]
    S = 3                                    # 3배 해상도 (표시 300x46)
    W, H = 300 * S, 46 * S
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    size = 34 * S
    while True:                              # 폭에 맞을 때까지 글자 크기 축소
        font = ImageFont.truetype(str(FONT), size)
        l, t, r, b = draw.textbbox((0, 0), text, font=font)
        if r - l <= W - 8 * S or size <= 18 * S: break
        size -= S
    color = (227, 38, 43, 255) if st["open"] else (75, 85, 99, 255)
    draw.text(((W - (r - l)) / 2 - l, (H - (b - t)) / 2 - t), text, font=font, fill=color)
    out = ROOT / "static"
    img.save(out / "deadline.png", optimize=True)
    (out / "deadline.json").write_text(json.dumps(st, ensure_ascii=False) + "\n", encoding="utf-8")
    print(today, "→", text)


if __name__ == "__main__":
    main()
