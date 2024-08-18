import { CircularProgress, Container } from "@mui/material";

export const Loading = () => (
  <Container
    sx={{
      display: "flex",
      justifyContent: "center",
    }}>
    <CircularProgress/>
  </Container>
)
