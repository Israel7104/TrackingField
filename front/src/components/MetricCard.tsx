type Props = {
  value: string
  label: string
}

export default function MetricCard({ value, label }: Props) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}
