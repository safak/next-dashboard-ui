import { render, screen } from '@testing-library/react';
import NavBar from '../NavBar';

describe('NavBar component', () => {
  it('renders the user name', () => {
    render(<NavBar />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
