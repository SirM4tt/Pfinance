const CATEGORY_NAMES = [
  'Housing',
  'Food & Dining',
  'Transport',
  'Shopping',
  'Healthcare',
  'Entertainment',
  'Utilities',
  'Other',
]

const RECEIPT_PROMPT = `Extract the following from this receipt image and return ONLY a valid JSON object with no markdown, no explanation:
{
  "merchant": "store or merchant name",
  "amount": total amount paid as a number (no currency symbol),
  "date": "YYYY-MM-DD",
  "category": "one of: ${CATEGORY_NAMES.join(', ')}"
}

Pick category based on merchant name. Use today's date only if no date is visible on the receipt.`

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function parseReceiptJson(text) {
  const cleaned = text.replace(/```json\s*|```/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')
  return JSON.parse(match[0])
}

export async function scanReceipt(imageFile) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY')

  const dataUrl = await fileToBase64(imageFile)
  const [header, base64Data] = dataUrl.split(',')
  const mediaType = header.match(/data:(.*?);/)?.[1] || imageFile.type || 'image/jpeg'

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            { type: 'text', text: RECEIPT_PROMPT },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.find((b) => b.type === 'text')?.text
  if (!text) throw new Error('Empty response')

  const parsed = parseReceiptJson(text)
  if (!parsed.merchant || parsed.amount == null) throw new Error('Incomplete receipt data')

  return {
    merchant: String(parsed.merchant).trim(),
    amount: Number(parsed.amount),
    date: parsed.date,
    category: parsed.category,
    thumbnail: dataUrl,
  }
}

export function matchCategoryId(categoryName, categories) {
  const name = categoryName?.trim()
  const match = categories.find((c) => c.name.toLowerCase() === name?.toLowerCase())
  if (match) return match.id
  const other = categories.find((c) => c.name === 'Other')
  return other?.id || categories[0]?.id || ''
}
