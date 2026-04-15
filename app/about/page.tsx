import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'sadowara navi について',
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-5">
              About
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 leading-[1.05]">
              sadowara navi について
            </h1>
          </div>
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          <div className="max-w-2xl prose prose-gray prose-lg">
            <p>
              sadowara navi
              は、宮崎県・佐土原のローカル情報をお届けする読み物メディアです。
              グルメ、観光、暮らし、地域のイベントなど、佐土原で暮らす人・訪れる人に役立つ情報を発信しています。
            </p>
            <h2>運営方針</h2>
            <p>
              地元の視点で、現地に足を運んで撮影・取材した情報のみを掲載します。
              情報の正確性に努めますが、店舗の営業時間や価格、イベント開催情報などは変更されることがあります。
              訪問前に公式サイト等で最新情報をご確認ください。
            </p>
            <h2>お問い合わせ</h2>
            <p>
              掲載依頼・取材依頼・誤情報のご指摘などは
              <a href="/contact" className="underline">お問い合わせフォーム</a>
              よりご連絡ください。
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
