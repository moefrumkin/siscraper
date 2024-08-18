export const APIError = (props: { error: Error }) => (
  <div>
    <h2>An error occured:</h2>
    <p>{props.error.name}: {props.error.message}</p>
    <p>{props.error.stack}</p>
  </div>
)