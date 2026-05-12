import type { Request, Response } from 'express'
import { profileService } from '../services/profileService.js'

function extractEmail(req: Request): string | null {
  const email = req.query.email

  if (typeof email === 'string' && email.trim().length > 0) {
    return email.trim()
  }

  return null
}

export const profileController = {
  getProfile(req: Request, res: Response) {
    try {
      const email = extractEmail(req)

      if (!email) {
        res.status(400).json({ message: 'Email requerido como parámetro ?email=...' })
        return
      }

      const profile = profileService.getProfile(email)
      res.status(200).json(profile)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error interno del servidor.'
      res.status(500).json({ message })
    }
  },

  setProfile(req: Request, res: Response) {
    try {
      const email = extractEmail(req)

      if (!email) {
        res.status(400).json({ message: 'Email requerido como parámetro ?email=...' })
        return
      }

      const profile = profileService.setProfile(email, req.body)
      res.status(200).json(profile)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error interno del servidor.'
      res.status(400).json({ message })
    }
  },
}
