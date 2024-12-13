import { Row } from '#types/index'
import { mapParmasValidator } from '#validators/map_param'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import csvParser from 'csv-parser'
import fs from 'node:fs'
import path from 'node:path'

export default class HomeController {
  async index(ctx: HttpContext) {
    const params = await ctx.request.validateUsing(mapParmasValidator)
    console.log(params.count)
    const data = await this.getData(params.count)
    const centralPoint = this.calculateCentralPoint(
      data.map((row) => ({ latitude: Number(row.latitude), longitude: Number(row.longitude) }))
    )
    return ctx.inertia.render('home', { data, centralPoint })
  }

  readCsvFile(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = []

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err))
    })
  }

  async readMultipleCsvFiles(directoryPath: string, totalLimit: number): Promise<Row[]> {
    try {
      const files = fs.readdirSync(directoryPath)

      // Filtrer pour ne garder que les fichiers CSV
      const csvFiles = files.filter((file) => file.endsWith('.csv'))

      let combinedData: any[] = []
      const limitPerFile = Math.ceil(totalLimit / csvFiles.length)

      for (const csvFile of csvFiles) {
        const filePath = path.join(directoryPath, csvFile)
        const data = await this.readCsvFile(filePath)
        combinedData = combinedData.concat(data.slice(0, limitPerFile))
      }

      // Filtrer les données dupliquées par la clé "listing_url"
      const uniqueData = Array.from(
        new Map(combinedData.map((item) => [item.listing_url, item])).values()
      )

      return uniqueData.slice(0, totalLimit) // S'assurer de ne pas dépasser la limite totale
    } catch (error) {
      throw new Error(`Erreur lors de la lecture des fichiers : ${error.message}`)
    }
  }

  calculateCentralPoint = (
    locations: { latitude: number; longitude: number }[]
  ): { latitude: number; longitude: number } => {
    if (locations.length === 0) {
      throw new Error('Aucune localisation fournie pour le calcul du point central.')
    }

    let totalLat = 0
    let totalLon = 0

    for (const location of locations) {
      totalLat += location.latitude
      totalLon += location.longitude
    }

    const centralLatitude = totalLat / locations.length
    const centralLongitude = totalLon / locations.length

    return {
      latitude: centralLatitude,
      longitude: centralLongitude,
    }
  }

  getData(count: number) {
    return this.readMultipleCsvFiles(app.makePath('csvs'), count) as Promise<Row[]>
  }
}
