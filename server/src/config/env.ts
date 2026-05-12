function parseAllowedOrigins(value: string) {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  allowedOrigins: parseAllowedOrigins(process.env.FRONTEND_ORIGIN ?? '*'),
  allowVercelPreviews: (process.env.ALLOW_VERCEL_PREVIEWS ?? 'true').toLowerCase() === 'true',
}