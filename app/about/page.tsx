export default function AboutPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-32">
      <section className="pt-16 md:pt-24 pb-16 md:pb-24 border-b border-line">
        <span className="eyebrow">— Colophon</span>
        <h1 className="animate-fade-in mt-6 font-display font-black text-[clamp(2.8rem,9vw,7rem)] leading-[0.98] tracking-[-0.035em]">
          About<span className="text-accent">.</span>
        </h1>
        <p className="mt-10 max-w-2xl text-lg md:text-xl text-mute leading-[1.85] font-display italic">
          佐土原という、ちいさな町から。
          <br />
          ローカルの暮らしを、ゆっくり綴る場所。
        </p>
      </section>

      <div className="grid md:grid-cols-12 gap-12 mt-16 md:mt-24">
        <aside className="md:col-span-3">
          <ol className="space-y-4 text-sm">
            <li>
              <span className="font-mono text-xs text-accent mr-3">01</span>
              <a href="#about" className="link-underline">このブログについて</a>
            </li>
            <li>
              <span className="font-mono text-xs text-accent mr-3">02</span>
              <a href="#editor" className="link-underline">運営者</a>
            </li>
            <li>
              <span className="font-mono text-xs text-accent mr-3">03</span>
              <a href="#contact" className="link-underline">お問い合わせ</a>
            </li>
          </ol>
        </aside>

        <div className="md:col-span-9 space-y-20">
          <section id="about" className="animate-fade-in">
            <div className="flex items-baseline gap-5 mb-6">
              <span className="font-mono text-xs text-accent">— 01</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                このブログについて
              </h2>
            </div>
            <p className="text-base md:text-lg text-ink/80 leading-[2.05] max-w-2xl">
              <span className="font-display text-5xl font-bold float-left leading-[0.85] mr-3 text-accent">s</span>
              adowara navi は、宮崎県佐土原の暮らしや地域の情報をお届けするブログです。
              グルメ、イベント、暮らしに役立つ情報を、地元の視点で丁寧に発信しています。
              観光ガイドにも雑誌にも載らない、ちいさな町のあたたかな物語を。
            </p>
          </section>

          <section id="editor" className="animate-fade-in">
            <div className="flex items-baseline gap-5 mb-6">
              <span className="font-mono text-xs text-accent">— 02</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                運営者
              </h2>
            </div>
            <p className="text-base md:text-lg text-ink/80 leading-[2.05] max-w-2xl">
              ここに自己紹介を書いてください。
            </p>
          </section>

          <section id="contact" className="animate-fade-in">
            <div className="flex items-baseline gap-5 mb-6">
              <span className="font-mono text-xs text-accent">— 03</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                お問い合わせ
              </h2>
            </div>
            <p className="text-base md:text-lg text-ink/80 leading-[2.05] max-w-2xl">
              お問い合わせは以下からお願いします。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
