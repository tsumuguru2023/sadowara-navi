import {Suspense} from 'react'
import {PortableText} from '@portabletext/react'

import {AllPosts} from '@/app/components/Posts'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {dataAttr} from '@/sanity/lib/utils'

export default async function Page() {
  const {data: settings} = await sanityFetch({query: settingsQuery})

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative bg-white">
        <div className="container py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-5">
              Local Journal · Miyazaki / Sadowara
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-gray-900 leading-[1.05]">
              {settings?.title || 'sadowara navi'}
            </h1>
            {settings?.description ? (
              <div className="mt-6 prose prose-lg text-gray-600 max-w-2xl">
                <div
                  data-sanity={dataAttr({
                    id: settings._id,
                    type: 'settings',
                    path: 'description',
                  }).toString()}
                >
                  <PortableText value={settings.description} />
                </div>
              </div>
            ) : (
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                宮崎県・佐土原の暮らしと地域の物語を、ローカルの視点で。
                グルメ、イベント、暮らしのリアルを、ゆっくり丁寧に綴る読み物。
              </p>
            )}
          </div>
        </div>
        <div className="border-b border-gray-100" />
      </section>

      {/* ===== Posts ===== */}
      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          <Suspense>{await AllPosts()}</Suspense>
        </div>
      </section>
    </>
  )
}
