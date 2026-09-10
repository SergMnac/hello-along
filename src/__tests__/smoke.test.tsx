import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import UnderConstructionPage from '../UnderConstructionPage';

describe('smoke', () => {
  it('renders EN content', () => {
    const { getByText } = render(<UnderConstructionPage locale={'en'} />);
    expect(getByText('Every city has stories waiting to happen.')).toBeTruthy();
  });
});
