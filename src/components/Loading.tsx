import { CircularProgress, Container } from "@mui/material";

/**
 * JSX component that shows a loading screen. 
 */
export const Loading = () => (
  <Container
    sx={{
      display: "flex",
      justifyContent: "center",
    }}>
    <CircularProgress/>
  </Container>
)
