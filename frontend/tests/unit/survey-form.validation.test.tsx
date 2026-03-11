import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SurveyPage from '../../src/pages/SurveyPage'

describe('Survey form validation', () => {
  it('shows an error summary when required fields are missing', async () => {
    render(<SurveyPage />)

    await userEvent.click(
      screen.getByRole('button', { name: /review responses/i }),
    )

    expect(
      await screen.findByRole('alert', { name: /form errors/i }),
    ).toBeInTheDocument()
  })
})
