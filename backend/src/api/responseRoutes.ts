import { Router } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { HttpError } from '../middleware/error-handler'
import { getResponseSummaries } from '../services/responseListService'
import { getResponseDetail } from '../services/responseDetailService'
import { getEnrichedResponseDetail } from '../services/enrichedResponseService'
import { createReviewDecision } from '../services/reviewDecisionService'
import { reviewSchema } from '../validators/review-schema'

export const responseRouter = Router()

responseRouter.get(
  '/collections/:collectionId/responses',
  requireAdmin,
  async (req, res, next) => {
    try {
      const limitRaw = req.query.limit
      const offsetRaw = req.query.offset

      const limit = limitRaw ? Number(limitRaw) : 50
      const offset = offsetRaw ? Number(offsetRaw) : 0

      if (!Number.isFinite(limit) || limit <= 0 || limit > 200) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid limit value.')
      }

      if (!Number.isFinite(offset) || offset < 0) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid offset value.')
      }

      const { items, total } = await getResponseSummaries(limit, offset)
      res.status(200).json({ items, total })
    } catch (error) {
      next(error)
    }
  },
)

responseRouter.get('/responses/:responseId', requireAdmin, async (req, res, next) => {
  try {
    const responseId = Array.isArray(req.params.responseId)
      ? req.params.responseId[0]
      : req.params.responseId

    if (!responseId) {
      throw new HttpError(400, 'VALIDATION_ERROR', 'Response id is required.')
    }

    const response = await getResponseDetail(responseId)

    if (!response) {
      throw new HttpError(404, 'NOT_FOUND', 'Response not found.')
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

responseRouter.get(
  '/admin/enriched-responses/:responseId',
  requireAdmin,
  async (req, res, next) => {
    try {
      const responseId = Array.isArray(req.params.responseId)
        ? req.params.responseId[0]
        : req.params.responseId

      if (!responseId) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Response id is required.')
      }

      const response = await getEnrichedResponseDetail(responseId)

      if (!response) {
        throw new HttpError(404, 'NOT_FOUND', 'Enriched response not found.')
      }

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  },
)

responseRouter.post(
  '/admin/enriched-responses/:responseId/reviews',
  requireAdmin,
  async (req, res, next) => {
    try {
      const responseId = Array.isArray(req.params.responseId)
        ? req.params.responseId[0]
        : req.params.responseId

      if (!responseId) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Response id is required.')
      }

      const adminId = req.user?.userId
      if (!adminId) {
        throw new HttpError(401, 'UNAUTHORIZED', 'Admin authentication required.')
      }

      const parsed = reviewSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid review payload.')
      }

      const decision = await createReviewDecision({
        enrichedResponseId: responseId,
        status: parsed.data.status,
        note: parsed.data.note,
        adminId,
      })

      if (!decision) {
        throw new HttpError(404, 'NOT_FOUND', 'Enriched response not found.')
      }

      res.status(201).json(decision)
    } catch (error) {
      next(error)
    }
  },
)
