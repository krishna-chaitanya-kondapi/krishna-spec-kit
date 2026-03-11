import { promises as fs } from 'fs'

const quoteIfNeeded = (value: string) => {
  const needsQuotes = value.includes(',') || value.includes('"') || value.includes('\n')
  if (!needsQuotes) return value
  return `"${value.replace(/"/g, '""')}"`
}

const parseCsvLine = (line: string) => {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      const next = line[i + 1]
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

let writeQueue: Promise<void> = Promise.resolve()

export const ensureCsvFile = async (filePath: string, header: string[]) => {
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, `${header.join(',')}\n`, 'utf-8')
  }
}

export const appendCsvRow = async (filePath: string, row: string[]) => {
  const line = row.map((value) => quoteIfNeeded(value)).join(',')

  writeQueue = writeQueue.then(async () => {
    await fs.appendFile(filePath, `${line}\n`, 'utf-8')
  })

  return writeQueue
}

export const readCsv = async (filePath: string) => {
  const content = await fs.readFile(filePath, 'utf-8')
  const lines = content.split(/\r?\n/).filter(Boolean)

  if (!lines.length) {
    return { header: [] as string[], rows: [] as Record<string, string>[] }
  }

  const header = parseCsvLine(lines[0])
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return header.reduce<Record<string, string>>((acc, key, index) => {
      acc[key] = values[index] ?? ''
      return acc
    }, {})
  })

  return { header, rows }
}
