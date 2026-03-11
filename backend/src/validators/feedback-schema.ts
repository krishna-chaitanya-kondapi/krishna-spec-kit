import { z } from 'zod'

const categoryEnum = z.enum([
  'Juniors',
  'Seniors',
  'Adult Males',
  'Adult Females',
])

const activityRatingSchema = z.object({
  activityName: z.string().min(1),
  rating: z.number().int().min(1).max(5),
})

const sectionResponseSchema = z.object({
  sectionName: z.enum(['Flexibility', 'Strength', 'Endurance']),
  activityRatings: z.array(activityRatingSchema).min(1),
  sectionComment: z.string().trim().max(1000).optional(),
})

const requiredActivities = {
  Flexibility: ['Suryanamaskarams'],
  Strength: ['Pushups', 'Plank', 'Squats'],
  Endurance: ['3K Running'],
} as const

export const feedbackSchema = z
  .object({
    category: categoryEnum,
    sectionResponses: z.array(sectionResponseSchema).min(3),
    overallComment: z.string().trim().max(1000).optional(),
  })
  .superRefine((value, ctx) => {
    const sections = new Map(
      value.sectionResponses.map((section) => [section.sectionName, section]),
    )

    ;(Object.keys(requiredActivities) as Array<
      keyof typeof requiredActivities
    >).forEach((sectionName) => {
      const section = sections.get(sectionName)
      if (!section) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing ${sectionName} section responses.`,
          path: ['sectionResponses'],
        })
        return
      }

      requiredActivities[sectionName].forEach((activityName) => {
        const found = section.activityRatings.find(
          (rating) => rating.activityName === activityName,
        )
        if (!found) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Missing rating for ${activityName}.`,
            path: ['sectionResponses', sectionName, activityName],
          })
        }
      })
    })
  })

export type FeedbackPayload = z.infer<typeof feedbackSchema>
