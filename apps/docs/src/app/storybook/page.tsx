export default function Page() {
  return (
    <div className="fixed inset-0">
      <iframe
        title="Vesper Storybook"
        className="w-full h-full"
        src="/storybook/index.html"
      />
    </div>
  );
}
