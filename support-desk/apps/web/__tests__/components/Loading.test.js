import { render, screen } from '@testing-library/react';
import Loading from '@/app/components/Loading';

describe('Loading', () => {
  it('renders loading text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
