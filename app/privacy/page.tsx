import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'sadowara navi のプライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-5">
              Privacy Policy
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 leading-[1.05]">
              プライバシーポリシー
            </h1>
          </div>
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          <div className="max-w-2xl prose prose-gray prose-lg">
            <p>
              sadowara navi（以下「当サイト」といいます）は、利用者の個人情報の保護に努めます。
              本ポリシーでは、当サイトにおける個人情報の取扱いについて定めます。
            </p>

            <h2>1. 取得する情報</h2>
            <p>当サイトでは、以下の情報を取得することがあります。</p>
            <ul>
              <li>お問い合わせフォーム等から自発的にご提供いただく氏名・メールアドレス等</li>
              <li>アクセスログ・Cookie・端末情報・IPアドレス等の技術情報</li>
            </ul>

            <h2>2. 利用目的</h2>
            <p>取得した情報は以下の目的で利用します。</p>
            <ul>
              <li>お問い合わせへの返信および対応</li>
              <li>サイトの改善・利用状況の分析</li>
              <li>不正アクセスの防止等のセキュリティ対策</li>
            </ul>

            <h2>3. アクセス解析ツールについて</h2>
            <p>
              当サイトでは、サイト改善のためにアクセス解析ツール（Vercel Analytics 等）を利用することがあります。
              これらのツールはCookieを利用して匿名のトラフィックデータを収集しますが、個人を特定する情報は含まれません。
            </p>

            <h2>4. 第三者提供</h2>
            <p>
              法令に基づく場合を除き、ご本人の同意なく第三者に個人情報を提供することはありません。
            </p>

            <h2>5. 著作権</h2>
            <p>
              当サイトに掲載されている記事・写真等の著作権は、当サイトまたは正当な権利者に帰属します。
              無断での転載・複製はご遠慮ください。
            </p>

            <h2>6. 免責事項</h2>
            <p>
              当サイトに掲載する情報には正確性に努めていますが、内容を保証するものではありません。
              掲載情報を利用したことにより生じた損害について、当サイトは一切の責任を負いません。
            </p>

            <h2>7. 改定について</h2>
            <p>
              本ポリシーの内容は、必要に応じて予告なく変更することがあります。
            </p>

            <h2>8. お問い合わせ</h2>
            <p>
              本ポリシーに関するお問い合わせは
              <a href="/contact" className="underline">お問い合わせフォーム</a>
              よりご連絡ください。
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
