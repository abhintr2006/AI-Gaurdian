import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders AI Guardian header", () => {
  render(<App />);
  const heading = screen.getByText(/AI Guardian/i);
  expect(heading).toBeInTheDocument();
});
