import csv
import json
from pathlib import Path


def fix_invalid_json_backslashes(body: str) -> str:
    hex4 = set("0123456789abcdefABCDEF")

    def u_esc_end(j: int):
        if j + 6 > len(body) or body[j + 1] != "u":
            return None
        if not all(body[j + 2 + k] in hex4 for k in range(4)):
            return None
        return j + 6

    out: list[str] = []
    i = 0
    n = len(body)

    while i < n:
        if body[i] != '"':
            out.append(body[i])
            i += 1
            continue

        out.append('"')
        i += 1
        while i < n:
            if body[i] == '"':
                out.append('"')
                i += 1
                break
            if body[i] != "\\":
                out.append(body[i])
                i += 1
                continue
            if i + 1 >= n:
                out.append("\\")
                i += 1
                break
            nx = body[i + 1]
            u_end = u_esc_end(i)
            if u_end is not None:
                out.append(body[i : u_end])
                i = u_end
                continue
            if nx in '"\\/':
                out.append(body[i : i + 2])
                i += 2
                continue
            out.append("\\\\")
            i += 1

    return "".join(out)


def main():
    root = Path(__file__).resolve().parent
    path = root / "sample-tasks.csv"

    with path.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        if not fieldnames:
            raise SystemExit("no header")
        rows = list(reader)

    for row in rows:
        a = row.get("answers") or ""
        if not str(a).strip():
            continue
        fixed = fix_invalid_json_backslashes(a)
        parsed = json.loads(fixed)
        for item in parsed:
            if isinstance(item, dict) and "\f" in str(item.get("text", "")):
                raise ValueError(f"formfeed in answers id={row.get('id')}")
        row["answers"] = fixed

    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=fieldnames,
            quoting=csv.QUOTE_MINIMAL,
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(rows)

    print("ok:", path)


if __name__ == "__main__":
    main()
