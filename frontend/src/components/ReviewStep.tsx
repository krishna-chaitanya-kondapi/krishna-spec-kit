import type { SurveyPayload } from '../services/survey-schema'
import { sectionActivities, sections } from '../services/survey-types'

type ReviewStepProps = {
  values: SurveyPayload
  onEdit: () => void
  onSubmit: () => void
  submitting: boolean
}

const ReviewStep = ({ values, onEdit, onSubmit, submitting }: ReviewStepProps) => (
  <div className="review-step">
    <h2>Review your responses</h2>
    <p className="survey-helper">
      Confirm the details below before submitting your feedback.
    </p>

    <div className="review-block">
      <h3>Participant Category</h3>
      <p>{values.category}</p>
    </div>

    {sections.map((sectionName) => {
      const section = values.sectionResponses.find(
        (item) => item.sectionName === sectionName,
      )

      return (
        <div key={sectionName} className="review-block">
          <h3>{sectionName}</h3>
          <ul>
            {sectionActivities[sectionName].map((activityName) => {
              const rating = section?.activityRatings.find(
                (item) => item.activityName === activityName,
              )?.rating

              return (
                <li key={activityName}>
                  <span>{activityName}</span>
                  <strong>{rating}</strong>
                </li>
              )
            })}
          </ul>
          {section?.sectionComment ? (
            <p className="review-comment">{section.sectionComment}</p>
          ) : null}
        </div>
      )
    })}

    {values.overallComment ? (
      <div className="review-block">
        <h3>Overall comments</h3>
        <p className="review-comment">{values.overallComment}</p>
      </div>
    ) : null}

    <div className="review-actions">
      <button type="button" className="review-edit" onClick={onEdit}>
        Edit responses
      </button>
      <button
        type="button"
        className="survey-submit"
        onClick={onSubmit}
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit feedback'}
      </button>
    </div>
  </div>
)

export default ReviewStep
