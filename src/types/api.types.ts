export type QueryParamValue = string | number | boolean | null | undefined;

export type ApiQueryParams = Record<string, QueryParamValue>;

export interface ApiMessage {
  CODE?: number;
  code?: number;
  MESSAGE?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  err?: boolean;
  mensaje_return?: ApiMessage;
  result_return?: T;
  result_list_user?: T;
  data?: T;
}

export function buildQueryParams(params?: ApiQueryParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}