import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SurveyPage from '../../src/pages/SurveyPage'

describe('Optional comments', () => {
  it('shows optional comments in the review summary', async () => {
    render(<SurveyPage />)

    await userEvent.click(screen.getByLabelText('Adult Females'))

    await userEvent.selectOptions(
      screen.getByLabelText('Suryanamaskarams'),
      '5',
    )
    await userEvent.selectOptions(screen.getByLabelText('Pushups'), '4')
    await userEvent.selectOptions(screen.getByLabelText('Plank'), '4')
    await userEvent.selectOptions(screen.getByLabelText('Squats'), '5')
    await userEvent.selectOptions(screen.getByLabelText('3K Running'), '3')

    const sectionCommentFields = screen.getAllByLabelText(/section comments/i)
    await userEvent.type(sectionCommentFields[0], 'Loved the pacing.')
    await userEvent.type(
      screen.getByLabelText(/overall comments/i),
      'Great organization.',
    )

    await userEvent.click(
      screen.getByRole('button', { name: /review responses/i }),
    )

    expect(await screen.findByText('Loved the pacing.')).toBeInTheDocument()
    expect(await screen.findByText('Great organization.')).toBeInTheDocument()
  })
})
