import { useEffect, useState } from "react";

const MEMO_KEY = "action_log_memo_v1";

export function GlobalMemo() {
  const [text, setText] = useState(() => localStorage.getItem(MEMO_KEY) ?? "");

  useEffect(() => {
    localStorage.setItem(MEMO_KEY, text);
  }, [text]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3">
      <h2 className="font-bold text-sm text-slate-600 m-0 mb-2">メモ欄</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="書き出し・後で見返すメモ"
        className="w-full h-[300px] border border-slate-200 rounded px-2 py-1.5 text-sm resize-y box-border"
      />
    </div>
  );
}
