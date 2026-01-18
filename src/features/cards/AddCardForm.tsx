type Props = {
  title: string;
  hypothesis: string;
  success: string;
  setTitle: (v: string) => void;
  setHypothesis: (v: string) => void;
  setSuccess: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function AddCardForm(props: Props) {
  const {
    title,
    hypothesis,
    success,
    setTitle,
    setHypothesis,
    setSuccess,
    onSubmit,
  } = props;

  return (
    <form
      onSubmit={onSubmit}
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
        placeholder="仮説(予想)"
      />
      <input
        value={success}
        onChange={(e) => setSuccess(e.target.value)}
        placeholder="成功条件"
      />
      <button type="submit">追加</button>
    </form>
  );
}
