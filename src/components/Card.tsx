import type { ReactNode } from "react";
import type { CardType } from "../types";

type Props = {
  c: CardType;
  onDelete: () => void;
  children: ReactNode;
};

export function Card(props: Props) {
  const { c, onDelete, children } = props;

  return (
    <article style={{ border: "1px solid #ccc", padding: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong style={{ flex: 1 }}>{c.title}</strong>
        <button type="button" onClick={onDelete}>
          削除
        </button>
      </div>

      <div>仮説: {c.hypothesis}</div>
      <div>成功: {c.success}</div>

      <div style={{ marginTop: 8 }}>{children}</div>
    </article>
  );
}
