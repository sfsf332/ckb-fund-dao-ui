import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import getPDSClient from "@/lib/pdsClient";

const isServer = typeof window === "undefined";

export const SERVER = process.env.NEXT_PUBLIC_API_ADDRESS


export type RequestConfig = AxiosRequestConfig & {
  // 获取完整的axios响应，否则只返回data
  getWholeResponse?: boolean
  // 获取完成的业务数据，否则只返回业务数据的data
  getWholeBizData?: boolean
}

type ConfigWithWholeResponse = AxiosRequestConfig & {
  getWholeResponse: true
}

type ConfigWithWholeBizData = AxiosRequestConfig & {
  getWholeBizData: true
}

type ConfigWithOriginData = AxiosRequestConfig & {
  getWholeResponse: true
  getWholeBizData: true
}

export interface APIResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
  success?: boolean;
  errorData?: Array<{
    errorCode: string;
    errorMessage: string;
    propertyName: string;
  }>;
}

export async function requestAPI<T = unknown, O extends ConfigWithOriginData = ConfigWithOriginData>(
  url: string,
  config: O
): Promise<AxiosResponse<APIResponse<T>>>;

export async function requestAPI<T = unknown, O extends ConfigWithWholeResponse = ConfigWithWholeResponse>(
  url: string,
  config: O
): Promise<AxiosResponse<T>>;

export async function requestAPI<T = unknown, O extends ConfigWithWholeBizData = ConfigWithWholeBizData>(
  url: string,
  config: O
): Promise<APIResponse<T>>;
export async function requestAPI<T = unknown, O = RequestConfig>(url: string, config: O): Promise<T>
export async function requestAPI(url: string, config: RequestConfig) {
  const pdsClient = getPDSClient()
  
  const token = pdsClient.session?.accessJwt
  
  console.log('API请求:', {
    url: `${SERVER}${url}`,
    method: config.method,
    hasToken: !!token
  });
  
  let response;
  try {
    response = await axios(`${ SERVER }${ url }`, {
      ...config,
      headers: {
        Authorization: token ? `Bearer ${token}` : token,
        ...config.headers,
      },
    });
    
    console.log('API响应:', {
      url,
      status: response.status,
      data: response.data
    });
  } catch (e) {
    const error = e as { message?: string; response?: { data?: unknown; status?: number } };
    console.error('API请求失败:', {
      url,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // 如果是 axios 错误，尝试返回错误响应
    if (error.response) {
      response = error.response;
    } else {
      // 网络错误或其他错误，返回一个模拟响应
      throw new Error(error.message || '网络请求失败');
    }
  }

  if (response?.data?.code === 401) {
    // throttleLogout();
  }

  const bizDataOnly = config.getWholeBizData !== true
  if (bizDataOnly)
    response.data = response.data.data
  const getResponse = config.getWholeResponse === true
  return getResponse ? response : response.data
}

export type FetchAPIReturnType<OPTIONS extends AxiosRequestConfig, ReturnDataType> =
  OPTIONS extends ConfigWithOriginData ? Promise<AxiosResponse<APIResponse<ReturnDataType | null>>>
    : OPTIONS extends ConfigWithWholeResponse ? Promise<AxiosResponse<ReturnDataType | null>>
      : OPTIONS extends ConfigWithWholeBizData ? Promise<APIResponse<ReturnDataType | null>>
        : Promise<ReturnDataType | null>;