import type { ReactNode } from "react";
import type { CardType } from "../types";

type Props = {
  title: string;
  items: CardType[];
  children: (c: CardType) => ReactNode;
};

export function Column(props: Props) {
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
