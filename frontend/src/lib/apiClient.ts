const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiErrorData {
  message: string;
  errors?: Record<string, string>; // For field-specific validation errors
  [key: string]: any;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface ApiClientOptions extends Omit<RequestInit, 'body'> { // Omit BodyInit from RequestInit
  body?: BodyInit | Record<string, any> | null; // Allow objects for stringification
  // We might add other custom options here later
}

async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { headers: customHeaders, body, ...customOptions } = options;

  const headers: HeadersInit = {
    // Default Content-Type, can be overridden by customHeaders
    ...(body && typeof body === 'object' && !(body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...customHeaders,
  };

  const config: RequestInit = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers,
    // Stringify body only if it's a JS object and not FormData
    body: (body && typeof body === 'object' && !(body instanceof FormData)) ? JSON.stringify(body) : body as BodyInit,
    ...customOptions,
    credentials: 'include', // Essential for Spring Security session cookies to be sent/received
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorData: ApiErrorData;
    try {
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const textError = await response.text();
        errorData = { message: textError || response.statusText || 'Request failed' };
      }
    } catch (e) {
      errorData = { message: response.statusText || 'Request failed' };
    }
    throw new ApiError(errorData.message || `API request to ${endpoint} failed with status ${response.status}`, response.status, errorData);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (contentType && contentType.includes("text/plain")) {
    return response.text() as Promise<T>;
  }
  
  return response.json();
}

export default apiClient; 