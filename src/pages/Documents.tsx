import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { DemoTag, Disclaimer } from '../components/shared/Disclaimer';

const MOCK_RESULT = {
  summary: 'Technical file for an electric storage water heater — 15L. Document contains product description, electrical schematic, and partial test data. Appears to be a draft submission package for BIS ISI certification.',
  extractedFields: [
    { label: 'Product Name', value: 'Aqua-Warm 15L Electric Water Heater' },
    { label: 'Manufacturer', value: 'HeatTech Industries, Jaipur' },
    { label: 'Rated Voltage', value: '230V AC, 50Hz' },
    { label: 'Rated Power', value: '2000W' },
    { label: 'Capacity', value: '15 Litres' },
    { label: 'Detected Standard Reference', value: 'IS 302-2-201' },
  ],
  missingInfo: [
    'Test report from BIS-recognised laboratory not found',
    'Thermal cut-off device specification sheet missing',
    'Factory address and GST number not provided',
    'Bill of Materials (BoM) not included',
  ],
  complianceGaps: [
    'Pressure relief valve specification not documented',
    'Insulation resistance test data not present',
    'Amendment 3 (2023) requirements not addressed',
  ],
  openQuestions: [
    'Is the thermal cutout rated for the correct temperature per Amendment 3?',
    'Has the product been tested at a BIS-recognised NABL lab?',
    'What is the working pressure rating of the tank?',
  ],
};

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'done';

export const Documents: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setUploadState('uploading');
    setTimeout(() => {
      setUploadState('analyzing');
      setTimeout(() => setUploadState('done'), 2000);
    }, 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setUploadState('idle');
    setFileName('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>
          Document Intelligence
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Upload a document to extract fields, identify compliance gaps, and flag missing information.
        </p>
      </div>

      {uploadState === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors"
          style={{
            borderColor: dragOver ? 'var(--color-blue)' : 'var(--color-border)',
            backgroundColor: dragOver ? 'rgba(23,105,170,0.04)' : 'var(--color-surface)',
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload document area"
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.txt"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            aria-label="Choose file to upload"
          />
          <Upload size={32} className="mx-auto mb-3" style={{ color: 'var(--color-blue)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Drag &amp; drop a document, or click to browse
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            PDF, DOCX, or TXT — technical files, application dossiers, test reports
          </p>
        </div>
      )}

      {(uploadState === 'uploading' || uploadState === 'analyzing') && (
        <div className="card p-6 text-center space-y-4">
          <FileText size={28} className="mx-auto" style={{ color: 'var(--color-blue)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{fileName}</p>
          <div className="space-y-2">
            {[
              { label: 'Uploading document…', done: uploadState === 'analyzing' },
              { label: 'Extracting fields & references…', done: false },
              { label: 'Analysing compliance gaps…', done: false },
            ].map(({ label, done }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: done ? 'rgba(35,134,54,0.1)' : 'rgba(23,105,170,0.1)' }}
                >
                  {done
                    ? <CheckCircle size={12} style={{ color: 'var(--color-success)' }} />
                    : <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-blue)' }} />
                  }
                </div>
                <span className="text-sm" style={{ color: done ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadState === 'done' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: 'var(--color-blue)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{fileName}</span>
              <DemoTag />
            </div>
            <button onClick={reset} className="btn-ghost gap-1.5 text-xs">
              <X size={13} />
              Clear
            </button>
          </div>

          <Disclaimer type="document" />

          {/* Summary */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Document Summary</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{MOCK_RESULT.summary}</p>
          </div>

          {/* Extracted fields */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Extracted Fields</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {MOCK_RESULT.extractedFields.map(({ label, value }) => (
                <div key={label} className="text-sm">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <p style={{ color: 'var(--color-text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing info */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-warning)' }}>Missing Information</h2>
            <ul className="space-y-1.5">
              {MOCK_RESULT.missingInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-warning)' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance gaps */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-error)' }}>Compliance Gaps</h2>
            <ul className="space-y-1.5">
              {MOCK_RESULT.complianceGaps.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Open questions */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Open Questions</h2>
            <ol className="space-y-1.5">
              {MOCK_RESULT.openQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: 'rgba(16,42,67,0.1)', color: 'var(--color-navy)' }}>{i + 1}</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{q}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
