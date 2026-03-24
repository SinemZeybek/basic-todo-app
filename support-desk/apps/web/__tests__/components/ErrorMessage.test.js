import { render, screen } from '@testing-library/react';
import ErrorMessage from '@/app/components/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the provided error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('renders a default message when none is provided', () => {
    render(<ErrorMessage />);
    expect(screen.getByText('An unexpected error occurred.')).toBeTruthy();
  });
});
