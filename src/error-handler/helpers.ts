import { StatusCodes, ReasonPhrases, getReasonPhrase } from 'http-status-codes';

export function getReasonByStatusCode(statusCode: StatusCodes): string {
  try {
    return getReasonPhrase(statusCode);
  } catch (e) {
    return ReasonPhrases.INTERNAL_SERVER_ERROR;
  }
}
