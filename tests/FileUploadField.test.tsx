/**
 * FileUploadField — TDD tests
 *
 * Covers:
 *  1. Renders file input with label + drag-drop affordance
 *  2. Validates file type (accept list)
 *  3. Validates max file size
 *  4. Emits onChange with selected File[]
 *  5. multiple prop supported
 *  6. Shows file list + remove buttons
 *  7. Accessibility: aria-label, role=button on dropzone, error via role=alert
 *  8. Keyboard: Enter/Space activates dropzone
 */
import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUploadField } from '../react/FileUploadField';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeFile(name: string, size: number, type: string): File {
  const f = new File(['x'.repeat(size)], name, { type });
  return f;
}

function dropFiles(dropzone: HTMLElement, files: File[]) {
  fireEvent.dragOver(dropzone, { dataTransfer: { files, types: ['Files'] } });
  fireEvent.drop(dropzone, { dataTransfer: { files } });
}

// ---------------------------------------------------------------------------
// 1. Renders label + hidden file input + visible dropzone
// ---------------------------------------------------------------------------
describe('FileUploadField — render', () => {
  it('renders label text', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    expect(screen.getByText('Attachments')).toBeInTheDocument();
  });

  it('renders a hidden file input', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.id).toBe('f');
  });

  it('renders a dropzone with role=button', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /drop files|upload/i })).toBeInTheDocument();
  });

  it('dropzone has an aria-label', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    expect(dz).toHaveAttribute('aria-label');
  });

  it('dropzone is focusable (tabIndex 0)', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    expect(dz).toHaveAttribute('tabindex', '0');
  });
});

// ---------------------------------------------------------------------------
// 2. onChange with selected File[]
// ---------------------------------------------------------------------------
describe('FileUploadField — onChange', () => {
  it('calls onChange with File[] when input changes', () => {
    const onChange = vi.fn();
    render(<FileUploadField id="f" label="Attachments" onChange={onChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('a.pdf', 100, 'application/pdf');
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toEqual([file]);
  });

  it('calls onChange with File[] on drop', () => {
    const onChange = vi.fn();
    render(<FileUploadField id="f" label="Attachments" onChange={onChange} />);
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    const file = makeFile('b.pdf', 200, 'application/pdf');
    dropFiles(dz, [file]);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toEqual([file]);
  });
});

// ---------------------------------------------------------------------------
// 3. multiple prop
// ---------------------------------------------------------------------------
describe('FileUploadField — multiple', () => {
  it('input does NOT have multiple by default', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toHaveAttribute('multiple');
  });

  it('input has multiple when prop is set', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('multiple');
  });

  it('onChange receives multiple files when multiple=true', () => {
    const onChange = vi.fn();
    render(<FileUploadField id="f" label="Attachments" onChange={onChange} multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [makeFile('a.pdf', 100, 'application/pdf'), makeFile('b.png', 200, 'image/png')];
    fireEvent.change(input, { target: { files } });
    expect(onChange.mock.calls[0][0]).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// 4. accept prop filters dialog + validates on drop
// ---------------------------------------------------------------------------
describe('FileUploadField — accept / type validation', () => {
  it('passes accept to the file input', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} accept="image/*" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('emits type error and does NOT call onChange when dropped file fails accept', () => {
    const onChange = vi.fn();
    render(
      <FileUploadField
        id="f"
        label="Attachments"
        onChange={onChange}
        accept="image/png,image/jpeg"
      />
    );
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    dropFiles(dz, [makeFile('doc.pdf', 100, 'application/pdf')]);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('clears type error when a valid file is dropped after an invalid one', () => {
    const onChange = vi.fn();
    render(
      <FileUploadField
        id="f"
        label="Attachments"
        onChange={onChange}
        accept="image/png"
      />
    );
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    // First: invalid
    dropFiles(dz, [makeFile('bad.pdf', 100, 'application/pdf')]);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Then: valid
    dropFiles(dz, [makeFile('good.png', 100, 'image/png')]);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. maxSize validation
// ---------------------------------------------------------------------------
describe('FileUploadField — maxSize validation', () => {
  it('emits size error and does NOT call onChange when file exceeds maxSize', () => {
    const onChange = vi.fn();
    render(
      <FileUploadField
        id="f"
        label="Attachments"
        onChange={onChange}
        maxSize={500}
      />
    );
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    dropFiles(dz, [makeFile('big.pdf', 1000, 'application/pdf')]);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('accepts file exactly at maxSize', () => {
    const onChange = vi.fn();
    render(
      <FileUploadField id="f" label="Attachments" onChange={onChange} maxSize={100} />
    );
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    dropFiles(dz, [makeFile('ok.pdf', 100, 'application/pdf')]);
    expect(onChange).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// 6. File list + remove buttons
// ---------------------------------------------------------------------------
describe('FileUploadField — file list', () => {
  it('shows file names after selection', () => {
    const onChange = vi.fn();
    render(<FileUploadField id="f" label="Attachments" onChange={onChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile('report.pdf', 100, 'application/pdf')] } });
    expect(screen.getByText(/report\.pdf/i)).toBeInTheDocument();
  });

  it('shows a remove button per file', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile('report.pdf', 100, 'application/pdf')] } });
    expect(screen.getByRole('button', { name: /remove report\.pdf/i })).toBeInTheDocument();
  });

  it('removes file and calls onChange when remove button clicked', () => {
    const onChange = vi.fn();
    render(<FileUploadField id="f" label="Attachments" onChange={onChange} multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: {
        files: [
          makeFile('a.pdf', 100, 'application/pdf'),
          makeFile('b.pdf', 100, 'application/pdf'),
        ],
      },
    });
    onChange.mockClear();
    act(() => {
      screen.getByRole('button', { name: /remove a\.pdf/i }).click();
    });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toHaveLength(1);
    expect(onChange.mock.calls[0][0][0].name).toBe('b.pdf');
    expect(screen.queryByText(/a\.pdf/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. Drag-active visual state
// ---------------------------------------------------------------------------
describe('FileUploadField — drag state', () => {
  it('adds drag-active class on dragover', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    fireEvent.dragOver(dz, { dataTransfer: { files: [], types: ['Files'] } });
    expect(dz.className).toMatch(/drag-active/);
  });

  it('removes drag-active class on dragleave', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    fireEvent.dragOver(dz, { dataTransfer: { files: [], types: ['Files'] } });
    fireEvent.dragLeave(dz);
    expect(dz.className).not.toMatch(/drag-active/);
  });
});

// ---------------------------------------------------------------------------
// 8. Keyboard: Enter / Space activates input
// ---------------------------------------------------------------------------
describe('FileUploadField — keyboard accessibility', () => {
  it('clicking the dropzone triggers the file input click', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    fireEvent.click(dz);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('Enter key on dropzone triggers the file input click', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    fireEvent.keyDown(dz, { key: 'Enter' });
    expect(clickSpy).toHaveBeenCalled();
  });

  it('Space key on dropzone triggers the file input click', () => {
    render(<FileUploadField id="f" label="Attachments" onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    fireEvent.keyDown(dz, { key: ' ' });
    expect(clickSpy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 9. error prop (external / form-level)
// ---------------------------------------------------------------------------
describe('FileUploadField — external error prop', () => {
  it('shows external error via role=alert', () => {
    render(
      <FileUploadField id="f" label="Attachments" onChange={() => {}} error="Required field" />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('input has aria-invalid when error present', () => {
    render(
      <FileUploadField id="f" label="Attachments" onChange={() => {}} error="Required" />
    );
    const dz = screen.getByRole('button', { name: /drop files|upload/i });
    expect(dz).toHaveAttribute('aria-invalid', 'true');
  });
});

// ---------------------------------------------------------------------------
// 10. formatFileSize utility
// ---------------------------------------------------------------------------
describe('formatFileSize utility', () => {
  it('formats bytes', async () => {
    const { formatFileSize } = await import('../react/fileUploadUtils');
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats kilobytes', async () => {
    const { formatFileSize } = await import('../react/fileUploadUtils');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats megabytes', async () => {
    const { formatFileSize } = await import('../react/fileUploadUtils');
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB');
  });
});

// ---------------------------------------------------------------------------
// 11. fileMatchesAccept utility — zero-MIME-type files matched by extension
// ---------------------------------------------------------------------------
describe('fileMatchesAccept utility', () => {
  it('returns true when accept is empty or undefined', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('test.whl', 100, '');
    expect(fileMatchesAccept(file)).toBe(true);
    expect(fileMatchesAccept(file, '')).toBe(true);
    expect(fileMatchesAccept(file, undefined)).toBe(true);
  });

  it('matches file with zero-MIME-type by extension when accept specifies extension', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('archive.whl', 100, '');
    expect(fileMatchesAccept(file, '.whl')).toBe(true);
  });

  it('does NOT match file with zero-MIME-type and non-matching extension', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('data.bin', 100, '');
    expect(fileMatchesAccept(file, '.whl')).toBe(false);
  });

  it('does NOT match file with zero-MIME-type against */* accept pattern', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('data.bin', 100, '');
    expect(fileMatchesAccept(file, '*/*')).toBe(false);
  });

  it('falls through to extension check for zero-MIME-type when image/* does not match', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('photo.whl', 100, '');
    expect(fileMatchesAccept(file, 'image/*')).toBe(false);
  });

  it('matches MIME type exactly for files with MIME type', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('document.pdf', 100, 'application/pdf');
    expect(fileMatchesAccept(file, 'application/pdf')).toBe(true);
  });

  it('matches wildcard MIME type for files with MIME type', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('photo.jpg', 100, 'image/jpeg');
    expect(fileMatchesAccept(file, 'image/*')).toBe(true);
  });

  it('does NOT match MIME type when file has different type', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const file = makeFile('document.pdf', 100, 'application/pdf');
    expect(fileMatchesAccept(file, 'application/json')).toBe(false);
  });

  it('matches multiple comma-separated patterns', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const pdfFile = makeFile('doc.pdf', 100, 'application/pdf');
    const jpgFile = makeFile('photo.jpg', 100, 'image/jpeg');
    expect(fileMatchesAccept(pdfFile, 'application/pdf,image/*')).toBe(true);
    expect(fileMatchesAccept(jpgFile, 'application/pdf,image/*')).toBe(true);
  });

  it('handles mixed extension and MIME type patterns', async () => {
    const { fileMatchesAccept } = await import('../react/fileUploadUtils');
    const csvFile = makeFile('data.csv', 100, '');
    const pdfFile = makeFile('doc.pdf', 100, 'application/pdf');
    expect(fileMatchesAccept(csvFile, '.csv,application/pdf')).toBe(true);
    expect(fileMatchesAccept(pdfFile, '.csv,application/pdf')).toBe(true);
  });
});
