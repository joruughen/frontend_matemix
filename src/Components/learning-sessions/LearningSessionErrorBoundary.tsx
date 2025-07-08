import type { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface LearningSessionErrorBoundaryProps {
  children: ReactNode;
}

const LearningSessionErrorBoundary: React.FC<LearningSessionErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default LearningSessionErrorBoundary;
