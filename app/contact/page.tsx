import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'sadowara navi へのお問い合わせ',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-5">
              Contact
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 leading-[1.05]">
              お問い合わせ
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              掲載依頼・取材依頼・誤情報のご指摘・その他のお問い合わせは下記よりご連絡ください。
            </p>
          </div>
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          <div className="max-w-2xl">
            <dl className="grid gap-8">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Email
                </dt>
                <dd className="text-lg text-gray-900">
                  <a
                    href="mailto:info@sadowara-navi.com"
                    className="underline hover:text-brand transition-colors"
                  >
                    info@sadowara-navi.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                  返信について
                </dt>
                <dd className="text-sm leading-6 text-gray-700">
                  内容を確認のうえ、3営業日以内を目安にご返信いたします。
                  お急ぎの場合や返信がない場合は、お手数ですが再度ご連絡ください。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
