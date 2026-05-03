import type { Request, Response } from 'express'
import { getDashboardData } from '../services/dashboardService.js'

export async function getDashboard(_request: Request, response: Response) {
  const data = await getDashboardData()
  response.status(200).json(data)
}

export function getHealth(_request: Request, response: Response) {
  response.status(200).json({ status: 'ok' })
}