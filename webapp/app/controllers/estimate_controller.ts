import { estimateFormValidator } from '#validators/estimate_form'
import type { HttpContext } from '@adonisjs/core/http'

export default class EstimateController {
  index(ctx: HttpContext) {
    return ctx.inertia.render('estimate')
  }

  async getPredictedPrice(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(estimateFormValidator)
    const instantBookable = payload.instant_bookable ? 't' : 'f'

    const finalPayload = {
      ...payload,
      instant_bookable: instantBookable,
    }

    const req = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      body: JSON.stringify(finalPayload),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = (await req.json()) as { predicted_price?: [number] }
    if (!data.predicted_price) {
      throw new Error('No predicted price found')
    }

    return ctx.inertia.render('estimate', { predictedPrice: data?.predicted_price?.at(0) })
  }
}
