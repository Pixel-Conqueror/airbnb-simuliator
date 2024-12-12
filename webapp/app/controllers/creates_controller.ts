import type { HttpContext } from '@adonisjs/core/http'

export default class CreatesController {
  index(ctx: HttpContext) {
    return ctx.inertia.render('create')
  }
}
