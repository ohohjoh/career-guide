"""
다음 접수 마감일 이미지 생성 (GitHub Actions가 매일 00:01 KST 실행)
  static/deadline.png  : 내 정보 박스에 거는 이미지 (빨간 날짜)
  static/deadline.json : 날짜 데이터
규칙: 매월 첫째 주(그달 첫 수요일이 든 월~일) 일요일 마감. 마감 다음 날부터 다음 달 마감일 표시.
"""
import json, datetime as dt
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "tools" / "Pretendard-ExtraBold.otf"
WD = "월화수목금토일"


def deadline_of(y, m):
    y, m = y + (m - 1) // 12, (m - 1) % 12 + 1
    first = dt.date(y, m, 1)
    return first + dt.timedelta((2 - first.weekday()) % 7 + 4)


def next_deadline(today):
    d = deadline_of(today.year, today.month)
    return d if today <= d else deadline_of(today.year, today.month + 1)


def main():
    today = dt.datetime.now(dt.timezone(dt.timedelta(hours=9))).date()      # 한국 날짜
    d = next_deadline(today)
    text = f"{d.month}월 {d.day}일({WD[d.weekday()]})"

    S = 3                                    # 3배 해상도 (표시 300x46)
    W, H = 300 * S, 46 * S
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(str(FONT), 38 * S)
    l, t, r, b = draw.textbbox((0, 0), text, font=font)
    draw.text(((W - (r - l)) / 2 - l, (H - (b - t)) / 2 - t), text, font=font, fill=(227, 38, 43, 255))
    out = ROOT / "static"
    img.save(out / "deadline.png", optimize=True)
    (out / "deadline.json").write_text(json.dumps(
        {"deadline": d.isoformat(), "label": text}, ensure_ascii=False) + "\n", encoding="utf-8")
    print(today, "→", text)


if __name__ == "__main__":
    main()
