import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SurveyPage from '../../src/pages/SurveyPage'

describe('Survey review flow', () => {
  it('allows review and edit before submission', async () => {
    render(<SurveyPage />)

    await userEvent.click(screen.getByLabelText('Juniors'))

    await userEvent.selectOptions(
      screen.getByLabelText('Suryanamaskarams'),
      '4',
    )
    await userEvent.selectOptions(screen.getByLabelText('Pushups'), '5')
    await userEvent.selectOptions(screen.getByLabelText('Plank'), '4')
    await userEvent.selectOptions(screen.getByLabelText('Squats'), '5')
    await userEvent.selectOptions(screen.getByLabelText('3K Running'), '3')

    await userEvent.click(
      screen.getByRole('button', { name: /review responses/i }),
    )

    expect(
      await screen.findByRole('heading', { name: /review your responses/i }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: /edit responses/i }),
    )

    expect(
      await screen.findByText(/participant category/i),
    ).toBeInTheDocument()
  })
})
