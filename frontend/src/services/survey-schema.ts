import { z } from 'zod'
import { categories, sectionActivities, sections } from './survey-types'

const ratingSchema = z.preprocess(
  (value) => (value === '' ? undefined : Number(value)),
  z.number().int().min(1).max(5),
)

const activityRatingSchema = z.object({
  activityName: z.string().min(1),
  rating: ratingSchema,
})

const sectionResponseSchema = z.object({
  sectionName: z.enum(sections),
  activityRatings: z.array(activityRatingSchema),
  sectionComment: z.string().trim().max(1000).optional(),
})

export const surveySchema = z
  .object({
    category: z.enum(categories),
    sectionResponses: z.array(sectionResponseSchema),
    overallComment: z.string().trim().max(1000).optional(),
  })
  .superRefine((value, ctx) => {
    const bySection = new Map(
      value.sectionResponses.map((section) => [section.sectionName, section]),
    )

    sections.forEach((sectionName) => {
      const section = bySection.get(sectionName)
      if (!section) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing ${sectionName} section responses.`,
          path: ['sectionResponses'],
        })
        return
      }

      const requiredActivities = sectionActivities[sectionName]
      requiredActivities.forEach((activityName) => {
        const activity = section.activityRatings.find(
          (rating) => rating.activityName === activityName,
        )
        if (!activity || typeof activity.rating !== 'number') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Missing rating for ${activityName}.`,
            path: ['sectionResponses', sectionName, activityName],
          })
        }
      })
    })
  })

export type SurveyFormValues = z.input<typeof surveySchema>
export type SurveyPayload = z.output<typeof surveySchema>
