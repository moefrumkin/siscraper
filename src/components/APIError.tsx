/**
 * A component to display an error that has occured with a call to a Firebase function 
 * @param props
 * @property error - the error that has occured
 */
export const APIError = (props: { error: Error }) => (
  <div>
    <h2>An error occured:</h2>
    <p>{props.error.name}: {props.error.message}</p>
    <p>{props.error.stack}</p>
  </div>
)