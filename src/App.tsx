import { useEffect, useMemo, useState } from "react";
import "./App.css";

import type {
  CardType,
  ClosingDraft,
  ClosingMap,
  ClosingPatch,
  Status,
} from "./types";
import { AddCardForm } from "./features/cards/AddCardForm";
import { Board } from "./features/cards/Board";

const STORAGE_KEY = "learning_log_cards_v1";

const emptyDraft: ClosingDraft = { result: "", learning: "" };

export default function App() {
  const [cards, setCards] = useState<CardType[]>([]);

  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [success, setSuccess] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [closing, setClosing] = useState<ClosingMap>({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) {
          const normalized: CardType[] = saved.map((x: any) => {
            const status: Status =
              x?.status === "planned" ||
              x?.status === "doing" ||
              x?.status === "done"
                ? x.status
                : "planned";

            return {
              id: typeof x?.id === "string" ? x.id : crypto.randomUUID(),
              title: typeof x?.title === "string" ? x.title : "",
              hypothesis: typeof x?.hypothesis === "string" ? x.hypothesis : "",
              success: typeof x?.success === "string" ? x.success : "",
              status,
              result: typeof x?.result === "string" ? x.result : "",
              learning: typeof x?.learning === "string" ? x.learning : "",
            };
          });

          setCards(normalized);
        }
      } catch {
        // ignore
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards, hydrated]);

  function addCard(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !hypothesis.trim() || !success.trim()) {
      alert("タイトル・仮説・成功条件は必須です");
      return;
    }

    const newCard: CardType = {
      id: crypto.randomUUID(),
      title: title.trim(),
      hypothesis: hypothesis.trim(),
      success: success.trim(),
      status: "planned",
      result: "",
      learning: "",
    };

    setCards((prev) => [newCard, ...prev]);

    setTitle("");
    setHypothesis("");
    setSuccess("");
  }

  function deleteCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setClosing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function setStatus(id: string, status: Status) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function startClosing(id: string) {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    setClosing((prev) => ({
      ...prev,
      [id]: { result: card.result || "", learning: card.learning || "" },
    }));
  }

  function updateClosing(id: string, patch: ClosingPatch) {
    setClosing((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? emptyDraft), ...patch },
    }));
  }

  function cancelClosing(id: string) {
    setClosing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function confirmDone(id: string) {
    const draft = closing[id];
    const result = (draft?.result ?? "").trim();
    const learning = (draft?.learning ?? "").trim();

    if (!result || !learning) {
      alert("結果・学びは必須です");
      return;
    }

    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "done", result, learning } : c,
      ),
    );

    cancelClosing(id);
  }

  const planned = useMemo(
    () => cards.filter((c) => c.status === "planned"),
    [cards],
  );
  const doing = useMemo(
    () => cards.filter((c) => c.status === "doing"),
    [cards],
  );
  const done = useMemo(() => cards.filter((c) => c.status === "done"), [cards]);

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Learning Log (Step 3)</h1>

      <AddCardForm
        title={title}
        hypothesis={hypothesis}
        success={success}
        setTitle={setTitle}
        setHypothesis={setHypothesis}
        setSuccess={setSuccess}
        onSubmit={addCard}
      />

      <hr />

      <Board
        planned={planned}
        doing={doing}
        done={done}
        closing={closing}
        onDeleteCard={deleteCard}
        onSetStatus={setStatus}
        onStartClosing={startClosing}
        onUpdateClosing={updateClosing}
        onCancelClosing={cancelClosing}
        onConfirmDone={confirmDone}
      />

      <hr />

      <h2>学びだけ一覧</h2>
      <ul style={{ paddingLeft: 18 }}>
        {done.length === 0 ? (
          <li>まだDoneがありません</li>
        ) : (
          done.map((c) => (
            <li key={c.id}>
              <strong>{c.learning}</strong> ({c.title})
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
