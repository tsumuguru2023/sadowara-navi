export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        header, footer, main { display: contents; }
        body > header, body > footer { display: none !important; }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
        {children}
      </div>
    </>
  );
}
