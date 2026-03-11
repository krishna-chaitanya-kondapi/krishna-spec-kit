import type { SurveyPayload } from './survey-schema'

export type FeedbackResponse = {
  submissionId: string
  message: string
  submittedAt: string
}

export const submitFeedback = async (payload: SurveyPayload) => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = 'Submission failed. Please try again.'

    try {
      const data = (await response.json()) as {
        error?: { message?: string; details?: Array<{ issue?: string }> }
      }
      if (data?.error?.message) {
        message = data.error.message
      }
      if (data?.error?.details?.length) {
        const detail = data.error.details[0]?.issue
        if (detail) {
          message = `${message} ${detail}`
        }
      }
    } catch {
      // Keep default message if response is not JSON.
    }

    throw new Error(message)
  }

  return (await response.json()) as FeedbackResponse
}
