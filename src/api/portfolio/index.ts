/**
 * @Description: 作品展示 API 接口
 * @Author: 安知鱼
 * @Date: 2025-01-23
 */
import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/http/config";
import type {
  PortfolioListResponse,
  Portfolio,
  PortfolioStats,
  GetPortfolioListParams
} from "@/types/portfolio";

// BaseResponse 类型定义
interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取作品列表
 */
export const getPortfolios = (params?: GetPortfolioListParams) => {
  return http.request<BaseResponse<PortfolioListResponse>>(
    "get",
    baseUrlApi("portfolios"),
    { params }
  );
};

/**
 * 获取作品详情
 */
export const getPortfolioById = (id: string) => {
  return http.request<BaseResponse<Portfolio>>(
    "get",
    baseUrlApi(`portfolios/${id}`)
  );
};

/**
 * 获取作品统计信息
 */
export const getPortfolioStats = () => {
  return http.request<BaseResponse<PortfolioStats>>(
    "get",
    baseUrlApi("portfolios/stats")
  );
};

/**
 * 创建作品
 */
export const createPortfolio = (data: Partial<Portfolio>) => {
  return http.request<BaseResponse<Portfolio>>(
    "post",
    baseUrlApi("portfolios"),
    { data }
  );
};

/**
 * 更新作品
 */
export const updatePortfolio = (id: string, data: Partial<Portfolio>) => {
  return http.request<BaseResponse<Portfolio>>(
    "put",
    baseUrlApi(`portfolios/${id}`),
    { data }
  );
};

/**
 * 删除作品
 */
export const deletePortfolio = (id: string) => {
  return http.request<BaseResponse<void>>(
    "delete",
    baseUrlApi(`portfolios/${id}`)
  );
};

/**
 * 批量删除作品
 */
export const batchDeletePortfolios = (ids: string[]) => {
  return http.request<BaseResponse<{ success_count: number; failed_count: number }>>(
    "post",
    baseUrlApi("portfolios/batch-delete"),
    { data: { ids } }
  );
};

/**
 * 更新作品排序
 */
export const updatePortfolioSortOrder = (data: Array<{ id: string; sort_order: number }>) => {
  return http.request<BaseResponse<void>>(
    "post",
    baseUrlApi("portfolios/sort"),
    { data }
  );
};

/**
 * 切换作品精选状态
 */
export const togglePortfolioFeatured = (id: string, featured: boolean) => {
  return http.request<BaseResponse<Portfolio>>(
    "put",
    baseUrlApi(`portfolios/${id}/featured`),
    { data: { featured } }
  );
};
