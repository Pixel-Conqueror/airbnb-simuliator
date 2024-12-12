import { Row } from '#types/index'
import type { HttpContext } from '@adonisjs/core/http'
import csvParser from 'csv-parser'
import fs from 'node:fs'
import path from 'node:path'

export default class HomeController {
  async index(ctx: HttpContext) {
    const data = await this.getData()
    return ctx.inertia.render('home', { data })
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
  async readMultipleCsvFiles(directoryPath: string): Promise<Row[]> {
    try {
      const files = fs.readdirSync(directoryPath)

      // Filtrer pour ne garder que les fichiers CSV
      const csvFiles = files.filter((file) => file.endsWith('.csv'))

      let combinedData: any[] = []

      for (const csvFile of csvFiles) {
        const filePath = path.join(directoryPath, csvFile)
        const data = await this.readCsvFile(filePath)
        combinedData = combinedData.concat(data)
      }

      return combinedData
    } catch (error) {
      throw new Error(`Erreur lors de la lecture des fichiers : ${error.message}`)
    }
  }

  getData() {
    return this.readMultipleCsvFiles(
      '/home/sonny/ipssi/machine-learning/airbnb-simuliator/webapp/csvs'
    ) as Promise<Row[]>
  }
}
