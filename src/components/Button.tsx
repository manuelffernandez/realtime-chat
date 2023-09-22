import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { type ButtonHTMLAttributes, type FC } from 'react'

const buttonStyles = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      intent: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200'
      },
      size: {
        default: 'h-10 py-2 px-4 text-sm font-medium',
        sm: 'h-9 px-2 text-xs font-normal',
        lg: 'h-11 px-8 text-base font-medium'
      },
      fullWidth: {
        true: 'w-full'
      }
    },
    defaultVariants: {
      intent: 'default',
      size: 'default'
    }
  }
)

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonStyles> {
  isLoading?: boolean
}

const Button: FC<Props> = ({ className, children, intent, size, fullWidth, isLoading, ...buttonProps }) => {
  return (
    <button className={buttonStyles({ intent, size, fullWidth })} disabled={isLoading} {...buttonProps}>
      {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
      {children}
    </button>
  )
}

export default Button
