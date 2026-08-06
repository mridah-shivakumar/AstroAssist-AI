type SpinnerSize = 'sm' | 'md' | 'lg'

interface LoadingSpinnerProps {
  size?: SpinnerSize
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`
        inline-block rounded-full
        border-space-border border-t-space-blue-400
        animate-spin
        ${sizeMap[size]}
      `}
    />
  )
}
