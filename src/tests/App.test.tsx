import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';


// add a test to check that the app renders correctly
test('renders the app', () => {
  render(<App />);
  expect(screen.getByText('Writer Project Management Tool')).toBeInTheDocument();
});
// add a test to check that the app renders the task list
test('renders the task list', () => {
  render(<App />);
  expect(screen.getByText('Tasks')).toBeInTheDocument();
});
