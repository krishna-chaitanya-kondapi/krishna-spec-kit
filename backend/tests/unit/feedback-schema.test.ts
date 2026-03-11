import { feedbackSchema } from '../../src/validators/feedback-schema'

describe('feedbackSchema', () => {
  it('rejects comments longer than 1000 characters', () => {
    const payload = {
      category: 'Juniors',
      sectionResponses: [
        {
          sectionName: 'Flexibility',
          activityRatings: [{ activityName: 'Suryanamaskarams', rating: 4 }],
          sectionComment: 'a'.repeat(1001),
        },
        {
          sectionName: 'Strength',
          activityRatings: [
            { activityName: 'Pushups', rating: 5 },
            { activityName: 'Plank', rating: 4 },
            { activityName: 'Squats', rating: 5 },
          ],
        },
        {
          sectionName: 'Endurance',
          activityRatings: [{ activityName: '3K Running', rating: 3 }],
        },
      ],
      overallComment: 'b'.repeat(1001),
    }

    const result = feedbackSchema.safeParse(payload)

    expect(result.success).toBe(false)
  })
})
