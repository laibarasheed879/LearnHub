import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the LearnHub home link', () => {
  render(<App />);
  expect(
    screen.getByRole("link", { name: "LearnHub home" })
  ).toBeInTheDocument();
});
