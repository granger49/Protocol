export default function StarRating({
  value,
  onChange,
  size = 'md',
  readOnly = false,
}: {
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
}) {
  const textSize = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }[size]

  return (
    <div className={`flex gap-0.5 ${textSize}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(i)}
          className={`leading-none ${readOnly ? 'cursor-default' : 'cursor-pointer active:scale-90 transition-transform'} ${
            i <= value ? 'text-accent' : 'text-white/15'
          }`}
          aria-label={`${i} star`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
