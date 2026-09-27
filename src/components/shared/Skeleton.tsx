import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`skeleton ${className}`} style={style} aria-hidden="true" />
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2" aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
    ))}
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="card p-4 space-y-3" aria-hidden="true">
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-32" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <tr aria-hidden="true">
    {[40, 140, 200, 80, 70, 90].map((w, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className={`h-4`} style={{ width: w }} />
      </td>
    ))}
  </tr>
);

export const SkeletonAnswerBlock: React.FC = () => (
  <div className="space-y-4" aria-hidden="true">
    <Skeleton className="h-5 w-48" />
    <SkeletonText lines={4} />
    <div className="space-y-2 pt-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  </div>
);
