import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ApiErrorBanner from '../components/ApiErrorBanner'
import ErrorSummary from '../components/ErrorSummary'
import ReviewStep from '../components/ReviewStep'
import {
  categories,
  ratingOptions,
  sectionActivities,
  sections,
} from '../services/survey-types'
import {
  surveySchema,
  type SurveyFormValues,
  type SurveyPayload,
} from '../services/survey-schema'
import { submitFeedback } from '../services/feedback-api'
import '../styles/survey.css'

const buildDefaultValues = (): SurveyFormValues => ({
  category: '' as SurveyFormValues['category'],
  sectionResponses: sections.map((sectionName) => ({
    sectionName,
    activityRatings: sectionActivities[sectionName].map((activityName) => ({
      activityName,
      rating: '',
    })),
    sectionComment: '',
  })),
  overallComment: '',
})

const buildRatingId = (sectionName: string, activityName: string) =>
  `rating-${sectionName}-${activityName}`
    .toLowerCase()
    .replace(/\s+/g, '-')

const buildSectionHelpId = (sectionName: string) =>
  `section-help-${sectionName}`.toLowerCase().replace(/\s+/g, '-')

const SurveyPage = () => {
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form')
  const [submitState, setSubmitState] = useState<'idle' | 'submitting'>('idle')
  const [apiError, setApiError] = useState<string | null>(null)
  const [reviewData, setReviewData] = useState<SurveyPayload | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: buildDefaultValues(),
    mode: 'onSubmit',
  })

  const errorItems = useMemo(() => {
    const items: { id: string; message: string }[] = []

    if (errors.category) {
      items.push({ id: 'category-fieldset', message: 'Select a category.' })
    }

    sections.forEach((sectionName, sectionIndex) => {
      const sectionErrors = errors.sectionResponses?.[sectionIndex]
      if (!sectionErrors) return

      const activityErrors = sectionErrors.activityRatings
      if (!activityErrors) return

      sectionActivities[sectionName].forEach((activityName, activityIndex) => {
        if (activityErrors[activityIndex]?.rating) {
          items.push({
            id: buildRatingId(sectionName, activityName),
            message: `Rate ${activityName} in ${sectionName}.`,
          })
        }
      })
    })

    return items
  }, [errors])

  const handleReview = handleSubmit((values) => {
    const payload = surveySchema.parse(values)
    setReviewData(payload)
    setStep('review')
  })

  const handleFinalSubmit = async () => {
    if (!reviewData) return
    setApiError(null)
    setSubmitState('submitting')

    try {
      await submitFeedback(reviewData)
      setStep('success')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Submission failed. Please try again.'
      setApiError(message)
      setSubmitState('idle')
      setStep('form')
    }
  }

  return (
    <main className="survey-page">
      <header className="survey-hero">
        <p className="survey-tag">Trifit Janakul Health Challenge 2026</p>
        <h1>Competition Feedback Survey</h1>
        <p className="survey-subtitle">
          Share your experience across flexibility, strength, and endurance. Your
          input helps improve future events.
        </p>
      </header>

      <section className="survey-card">
        <ErrorSummary items={errorItems} />

        {step === 'success' ? (
          <div className="survey-success" role="status">
            <h2>Thank you for your feedback!</h2>
            <p>Your submission has been recorded.</p>
          </div>
        ) : step === 'review' && reviewData ? (
          <ReviewStep
            values={reviewData}
            onEdit={() => setStep('form')}
            onSubmit={handleFinalSubmit}
            submitting={submitState === 'submitting'}
          />
        ) : (
          <form onSubmit={(event) => event.preventDefault()} noValidate>
            <fieldset
              id="category-fieldset"
              className="survey-fieldset"
              aria-describedby="category-help"
            >
              <legend>Participant Category</legend>
              <p className="survey-helper" id="category-help">
                Select the category you competed in.
              </p>
              <div className="survey-grid">
                {categories.map((category) => (
                  <label key={category} className="survey-option">
                    <input
                      type="radio"
                      value={category}
                      {...register('category')}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {sections.map((sectionName, sectionIndex) => (
              <fieldset
                key={sectionName}
                className="survey-fieldset"
                aria-describedby={buildSectionHelpId(sectionName)}
              >
                <legend>{sectionName}</legend>
                <p
                  className="survey-helper"
                  id={buildSectionHelpId(sectionName)}
                >
                  Rate each activity from 1 (needs improvement) to 5 (excellent).
                </p>

                {sectionActivities[sectionName].map((activityName, activityIndex) => {
                  const inputId = buildRatingId(sectionName, activityName)
                  const errorMessage =
                    errors.sectionResponses?.[sectionIndex]?.activityRatings?.[
                      activityIndex
                    ]?.rating?.message

                  return (
                    <div key={activityName} className="survey-row">
                      <label htmlFor={inputId} className="survey-label">
                        {activityName}
                      </label>
                      <div className="survey-control">
                        <select
                          id={inputId}
                          aria-invalid={Boolean(errorMessage)}
                          aria-describedby={
                            errorMessage ? `${inputId}-error` : undefined
                          }
                          {...register(
                            `sectionResponses.${sectionIndex}.activityRatings.${activityIndex}.rating` as const,
                          )}
                        >
                          <option value="">Select rating</option>
                          {ratingOptions.map((rating) => (
                            <option key={rating} value={rating}>
                              {rating}
                            </option>
                          ))}
                        </select>
                        {errorMessage ? (
                          <span id={`${inputId}-error`} className="survey-error">
                            {errorMessage}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )
                })}

                <label className="survey-textarea">
                  <span>Section comments (optional)</span>
                  <textarea
                    rows={3}
                    {...register(
                      `sectionResponses.${sectionIndex}.sectionComment` as const,
                    )}
                  />
                </label>
              </fieldset>
            ))}

            <label className="survey-textarea">
              <span>Overall comments (optional)</span>
              <textarea rows={4} {...register('overallComment')} />
            </label>

            {apiError ? (
              <ApiErrorBanner message={apiError} />
            ) : null}

            <button
              type="button"
              className="survey-submit"
              onClick={handleReview}
            >
              Review responses
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default SurveyPage
