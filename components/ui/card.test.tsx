import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card', () => {
  it('renders card with all sections', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText(/card title/i)).toBeInTheDocument();
    expect(screen.getByText(/card description/i)).toBeInTheDocument();
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
    expect(screen.getByText(/card footer/i)).toBeInTheDocument();
  });

  it('renders card with only content', () => {
    render(
      <Card>
        <CardContent>Simple content</CardContent>
      </Card>
    );

    expect(screen.getByText(/simple content/i)).toBeInTheDocument();
  });

  it('renders card header independently', () => {
    render(
      <CardHeader>
        <CardTitle>Standalone Title</CardTitle>
      </CardHeader>
    );

    expect(screen.getByText(/standalone title/i)).toBeInTheDocument();
  });
});

