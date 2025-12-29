import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';

describe('Table', () => {
  it('renders complete table structure', () => {
    render(
      <Table>
        <TableCaption>Table Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText(/table caption/i)).toBeInTheDocument();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/footer/i)).toBeInTheDocument();
  });

  it('renders table without caption', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText(/header/i)).toBeInTheDocument();
    expect(screen.getByText(/data/i)).toBeInTheDocument();
  });

  it('renders multiple rows', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row 1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText(/row 1/i)).toBeInTheDocument();
    expect(screen.getByText(/row 2/i)).toBeInTheDocument();
    expect(screen.getByText(/row 3/i)).toBeInTheDocument();
  });
});

