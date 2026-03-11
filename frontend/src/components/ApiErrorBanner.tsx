type ApiErrorBannerProps = {
  message: string
}

const ApiErrorBanner = ({ message }: ApiErrorBannerProps) => (
  <div className="survey-api-error" role="alert">
    {message}
  </div>
)

export default ApiErrorBanner
