export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto max-w-6xl px-5 py-12 text-center">
        <p className="font-display text-xl italic text-secondary">
          “Không phải mọi câu chuyện đều có cái kết đẹp. Nhưng mọi câu chuyện đều đáng được kể.”
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Cách mà mình đã · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
