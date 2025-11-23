"use client"

type Props = {
    value?: number
    onChange?: (val: number) => void
}

export default function QuantityStepper({ value = 1, onChange }: Props) {
    const setValue = (val: number) => {
        const next = Math.max(1, val)
        onChange?.(next)
    }

    return (
        <div className="inline-flex items-center gap-3 rounded-full bg-muted px-3 py-1">
            <button
                type="button"
                onClick={() => setValue(value - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-sm"
            >
                –
            </button>

            <span className="w-4 text-center text-sm">{value}</span>

            <button
                type="button"
                onClick={() => setValue(value + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-sm"
            >
                +
            </button>
        </div>
    )
}
