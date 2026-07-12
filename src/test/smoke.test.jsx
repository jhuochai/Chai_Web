import { render, screen } from '@testing-library/react';

function Hello() {
  return <p>hello test harness</p>;
}

describe('test harness smoke test', () => {
  it('renders a component and finds it with RTL queries', () => {
    render(<Hello />);
    expect(screen.getByText('hello test harness')).toBeInTheDocument();
  });
});
