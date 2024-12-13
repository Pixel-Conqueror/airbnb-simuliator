import vine from '@vinejs/vine'

export const mapParmasValidator = vine.compile(
  vine.object({
    count: vine
      .number()
      .min(1)
      .max(1000)
      .parse((value) => value ?? 50),
  })
)
