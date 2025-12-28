import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "learning_log_cards_v1";

type Status = "planned" | "doing" | "done";

type CardType = {
  id: string;
  title: string;
  hypothesis: string;
  success: string;
  status: Status;

  result: string;
  learning: string;
};

type ClosingDraft = {
  result: string;
  learning: string;
};

type ClosingMap = Record<string, ClosingDraft>;

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
          const normalized = saved.map((x: any) => {
            const status =
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
      } catch {}
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

  function updateClosing(id: string, patch: Partial<ClosingDraft>) {
    setClosing((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { result: "", learning: "" }), ...patch },
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
        c.id === id ? { ...c, status: "done", result, learning } : c
      )
    );

    cancelClosing(id);
  }

  const planned = useMemo(
    () => cards.filter((c) => c.status === "planned"),
    [cards]
  );
  const doing = useMemo(
    () => cards.filter((c) => c.status === "doing"),
    [cards]
  );
  const done = useMemo(() => cards.filter((c) => c.status === "done"), [cards]);

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Learning Log (Step 3)</h1>

      <form
        onSubmit={addCard}
        style={{ display: "grid", gap: 8, maxWidth: 900 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
        />
        <input
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
          placeholder="仮設(予想)"
        />
        <input
          value={success}
          onChange={(e) => setSuccess(e.target.value)}
          placeholder="成功条件"
        />
        <button type="submit">追加</button>
      </form>

      <hr />

      <div
        style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <Column title="Planned" items={planned}>
          {(c) => (
            <Card key={c.id} c={c} onDelete={() => deleteCard(c.id)}>
              <button onClick={() => setStatus(c.id, "doing")}>Doingへ</button>
            </Card>
          )}
        </Column>

        <Column title="Doing" items={doing}>
          {(c) => {
            const isClosing = Boolean(closing[c.id]);

            return (
              <Card key={c.id} c={c} onDelete={() => deleteCard(c.id)}>
                {!isClosing ? (
                  <>
                    <button onClick={() => startClosing(c.id)}>
                      Done (入力へ)
                    </button>
                    <button onClick={() => setStatus(c.id, "planned")}>
                      plannedに戻る
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      width: "100%",
                      marginTop: 10,
                    }}
                  >
                    <textarea
                      value={closing[c.id].result}
                      onChange={(e) =>
                        updateClosing(c.id, { result: e.target.value })
                      }
                      placeholder="結果"
                    />
                    <textarea
                      value={closing[c.id].learning}
                      onChange={(e) =>
                        updateClosing(c.id, { learning: e.target.value })
                      }
                      placeholder="学び(原因)"
                    />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => confirmDone(c.id)}>
                        完了確定
                      </button>
                      <button onClick={() => cancelClosing(c.id)}>
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          }}
        </Column>

        <Column title="Done (見返し)" items={done}>
          {(c) => (
            <Card key={c.id} c={c} onDelete={() => deleteCard(c.id)}>
              <div style={{ marginTop: 8 }}>
                <div>
                  <strong>結果:</strong>
                  {c.result}
                </div>
                <div>
                  <strong>学び</strong>
                  {c.learning}
                </div>
              </div>
              <button onClick={() => setStatus(c.id, "doing")}>
                Doingに戻す
              </button>
            </Card>
          )}
        </Column>
      </div>

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

function Column(props: {
  title: string;
  items: CardType[];
  children: (c: CardType) => React.ReactNode;
}) {
  const { title, items, children } = props;

  return (
    <section style={{ border: "1px solid #ddd", padding: 12 }}>
      <h2>
        {title} <span style={{ fontSize: 12 }}>({items.length})</span>
      </h2>
      <div style={{ display: "grid", gap: 10 }}>
        {items.length === 0 ? <div>なし</div> : items.map(children)}
      </div>
    </section>
  );
}

function Card(props: {
  c: CardType;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const { c, onDelete, children } = props;

  return (
    <article style={{ border: "1px solid #ccc", padding: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong style={{ flex: 1 }}>{c.title}</strong>
        <button type="button" onClick={onDelete}>
          削除
        </button>
      </div>

      <div>仮説:{c.hypothesis}</div>
      <div>成功:{c.success}</div>

      <div style={{ marginTop: 8 }}>{children}</div>
    </article>
  );
}
