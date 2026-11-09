import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export const Slider = ({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) => (
  <input
    type="range"
    className={cn('app-slider w-full accent-primary', className)}
    {...props}
  />
)
