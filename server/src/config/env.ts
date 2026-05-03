export const env = {
  port: Number(process.env.PORT ?? 4000),
  allowedOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
}