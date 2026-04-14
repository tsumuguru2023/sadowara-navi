export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <h1
        className="text-3xl md:text-4xl font-bold tracking-tight animate-fade-in-up"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        About
      </h1>

      <div className="mt-10 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <section>
          <h2
            className="text-xl font-bold mb-4 pb-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            このブログについて
          </h2>
          <p className="leading-relaxed" style={{ color: '#333' }}>
            sadowara navi は、宮崎県佐土原の暮らしや地域の情報をお届けするブログです。
            グルメ、イベント、暮らしに役立つ情報を発信しています。
          </p>
        </section>

        <section>
          <h2
            className="text-xl font-bold mb-4 pb-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            運営者
          </h2>
          <p className="leading-relaxed" style={{ color: '#333' }}>
            ここに自己紹介を書いてください。
          </p>
        </section>

        <section>
          <h2
            className="text-xl font-bold mb-4 pb-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            お問い合わせ
          </h2>
          <p className="leading-relaxed" style={{ color: '#333' }}>
            お問い合わせは以下からお願いします。
          </p>
          {/* 必要に応じてメールアドレスやSNSリンクを追加 */}
        </section>
      </div>
    </div>
  );
}
