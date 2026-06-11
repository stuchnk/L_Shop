export function Loader({ text = "Загрузка..." }: { text?: string }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <div>{text}</div>
    </div>
  );
}
