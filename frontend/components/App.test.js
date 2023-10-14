// Write your tests here
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppFunctional from "./AppFunctional"
import '@testing-library/jest-dom/extend-expect'

test('renders left button text', () => {
  render(<AppFunctional />)
  const leftButton = screen.queryByText(/left/i)
  expect(leftButton).toBeInTheDocument();
})

test('typing in the email input works', () => {
  render(<AppFunctional />)
  const input = screen.getByPlaceholderText('type email')
  fireEvent.change(input, { target: { value: 'test@example.com' } })
  expect(input.value).toBe('test@example.com')
});

test('renders all buttons', () => {
  render(<AppFunctional />)
  const leftButton = screen.queryByRole('button', { name: /left/i })
  const upButton = screen.queryByRole('button', { name: /up/i })
  const rightButton = screen.queryByRole('button', { name: /right/i })
  const downButton = screen.queryByRole('button', { name: /down/i })
  const resetButton = screen.queryByRole('button', { name: /reset/i })
  expect(leftButton).toBeInTheDocument()

  expect(upButton).toBeInTheDocument()

  expect(rightButton).toBeInTheDocument()

  expect(downButton).toBeInTheDocument()

  expect(resetButton).toBeInTheDocument()

})
// test('sanity', () => {
//   expect(true).toBe(false)
// });

// test('render AppClass without errors', () => {
//   render(<AppClass/>);
// });

// test('render AppFunctional without errors', () => {
//   render(<AppFunctional/>);
// });