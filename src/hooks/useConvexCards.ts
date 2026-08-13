import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { CardType, Status } from "../types";

export function useConvexCards() {
  const raw = useQuery(api.cards.list) ?? [];

  // _idをidに変換して、アプリが使う CardTypeの形にそろえる
  const cards: CardType[] = raw.map((c) => ({
    id: c._id,
    title: c.title,
    hypothesis: c.hypothesis,
    success: c.success,
    status: c.status as Status,
    result: c.result,
    learning: c.learning,
    comment: c.comment,
    createdAt: c.createdAt,
    completedAt: c.completedAt,
  }));

  const planned = cards.filter((c) => c.status === "planned");
  const doing = cards.filter((c) => c.status === "doing");
  const done = cards.filter((c) => c.status === "done");

  // Convexのmutation (生)
  const add = useMutation(api.cards.add);
  const remove = useMutation(api.cards.remove);
  const patchTitle = useMutation(api.cards.editTitle);
  const patchStatus = useMutation(api.cards.updateStatus);
  const completeCard = useMutation(api.cards.complete);

  //アプリが今まで通り呼べる形にする
  function addCard(input: {
    title: string;
    hypothesis?: string;
    success?: string;
  }) {
    const title = input.title.trim();
    if (!title) {
      return { ok: false as const, error: "タイトルは必須です" };
    }
    add({
      title,
      hypothesis: input.hypothesis ?? "",
      success: input.success ?? "",
    });
    return { ok: true as const };
  }

  function complete(input: {
    id: string;
    result: string;
    learning: string;
    comment: string;
  }) {
    completeCard({
      id: input.id as Id<"cards">,
      result: input.result,
      learning: input.learning,
      comment: input.comment,
    });
  }

  function deleteCard(id: string) {
    remove({ id: id as Id<"cards"> });
  }

  function setStatus(id: string, status: Status) {
    patchStatus({ id: id as Id<"cards">, status });
  }

  function editTitle(id: string, title: string) {
    patchTitle({ id: id as Id<"cards">, title });
  }

  return {
    cards,
    planned,
    doing,
    done,
    addCard,
    deleteCard,
    setStatus,
    editTitle,
    complete,
  };
}
