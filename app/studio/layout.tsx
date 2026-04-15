export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <div style={{position: 'fixed', inset: 0, zIndex: 100, background: '#fff'}}>{children}</div>
  )
}
