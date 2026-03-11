import { promises as fs } from 'fs'

let writeQueue: Promise<void> = Promise.resolve()

export const appendCsvRow = async (filePath: string, row: string) => {
  writeQueue = writeQueue.then(async () => {
    await fs.appendFile(filePath, `${row}\n`, 'utf-8')
  })

  return writeQueue
}
