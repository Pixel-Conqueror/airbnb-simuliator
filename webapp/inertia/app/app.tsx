/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import BaseLayout from '~/layouts/_base_layout'
import '../css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'MaSuperApp'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const currentPage: any = await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    )

    currentPage.default.layout =
      currentPage.default.layout || ((p: any) => <BaseLayout children={p} />)

    return currentPage
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
