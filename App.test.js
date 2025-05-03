import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from './App'; // Make sure this path is correct

test('renders the heading text', () => {
  const { getByText } = render(<App />);
  const heading = getByText('Term Clarifier');
  expect(heading).toBeTruthy();
});

test('checks if input and button work', () => {
  const { getByPlaceholderText, getByText } = render(<App />);
  const input = getByPlaceholderText('Enter a term');
  fireEvent.changeText(input, 'photosynthesis'); // Simulate typing in the input
  const button = getByText('Search');
  fireEvent.press(button); // Simulate pressing the button
  expect(getByText('Definition:')).toBeTruthy(); // Check if definition is displayed
});
