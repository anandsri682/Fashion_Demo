import { Response } from 'express';
import { PaginationMeta } from './pagination';

export function sendSuccess(
  res: Response,
  statusCode: number,
  message: string,
  data?: Record<string, unknown> | unknown[] | null,
  pagination?: PaginationMeta
): Response {
  const body: Record<string, unknown> = { success: true, message };

  if (Array.isArray(data)) {
    // For list endpoints callers pass a { key: [...] } shape via `data` normally;
    // support raw arrays too for convenience.
    body.data = data;
  } else if (data && typeof data === 'object') {
    Object.assign(body, data);
  }

  if (pagination) {
    body.pagination = pagination;
  }

  return res.status(statusCode).json(body);
}
