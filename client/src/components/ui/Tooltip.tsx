import type { ReactElement } from 'react'

export const Tooltip = ({
  label,
  children,
}: {
  label: string
  children: ReactElement
}) => <span title={label}>{children}</span>
