import React from 'react';
import { Inbox, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  ctaLabel,
  ctaHref,
  icon,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
        style={{ backgroundColor: 'rgba(16,42,67,0.06)' }}
      >
        {icon ?? <Inbox size={22} style={{ color: 'var(--color-text-secondary)' }} />}
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm mb-4 max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </p>
      {ctaLabel && ctaHref && (
        <button className="btn-primary" onClick={() => navigate(ctaHref)}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  onGoBack,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
        style={{ backgroundColor: 'rgba(192,57,43,0.08)' }}
      >
        <AlertCircle size={22} style={{ color: 'var(--color-error)' }} />
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
        {message}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <button className="btn-primary" onClick={onRetry}>
            Try again
          </button>
        )}
        <button
          className="btn-secondary"
          onClick={onGoBack ?? (() => navigate(-1))}
        >
          Go back
        </button>
      </div>
    </div>
  );
};
