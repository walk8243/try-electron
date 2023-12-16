import { ReactNode } from 'react'
import { Typography } from '@mui/material'

export const Heading = ({ children, level = 1, hidden = false }: { children: ReactNode, level: 1 | 2 | 3 | 4 | 5 | 6, hidden?: boolean }) => (
  <Typography variant={`h${level}`} sx={{ ...(hidden ? { display: 'none' } : {}) }}>
    {children}
  </Typography>
)
