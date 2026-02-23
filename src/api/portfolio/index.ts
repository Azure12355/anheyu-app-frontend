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
 * 获取作品列表（公开接口）
 */
export const getPortfolios = (params?: GetPortfolioListParams) => {
  return http.request<BaseResponse<PortfolioListResponse>>(
    "get",
    "/api/public/portfolio/list",
    { params }
  );
};

/**
 * 获取作品详情（公开接口）
 */
export const getPortfolioById = (id: string) => {
  return http.request<BaseResponse<Portfolio>>(
    "get",
    `/api/public/portfolio/${id}`
  );
};

/**
 * 获取作品统计信息（公开接口）
 */
export const getPortfolioStats = () => {
  return http.request<BaseResponse<PortfolioStats>>(
    "get",
    "/api/public/portfolio/stats"
  );
};

/**
 * 创建作品（管理接口）
 */
export const createPortfolio = (data: Partial<Portfolio>) => {
  return http.request<BaseResponse<Portfolio>>(
    "post",
    "/api/portfolio",
    { data }
  );
};

/**
 * 更新作品（管理接口）
 */
export const updatePortfolio = (id: string, data: Partial<Portfolio>) => {
  return http.request<BaseResponse<Portfolio>>(
    "put",
    `/api/portfolio/${id}`,
    { data }
  );
};

/**
 * 删除作品（管理接口）
 */
export const deletePortfolio = (id: string) => {
  return http.request<BaseResponse<void>>(
    "delete",
    `/api/portfolio/${id}`
  );
};

/**
 * 批量删除作品（管理接口）
 */
export const batchDeletePortfolios = (ids: string[]) => {
  // 后端没有批量删除接口，前端逐个删除
  return Promise.all(
    ids.map(id =>
      http.request<BaseResponse<void>>(
        "delete",
        `/api/portfolio/${id}`
      )
    )
  ).then(results => {
    const successCount = results.filter(r => r.code === 200).length;
    const failedCount = results.length - successCount;
    return {
      data: { success_count: successCount, failed_count: failedCount }
    } as BaseResponse<{ success_count: number; failed_count: number }>;
  });
};

/**
 * 更新作品排序（管理接口）
 */
export const updatePortfolioSortOrder = (sorts: Record<string, number>) => {
  return http.request<BaseResponse<void>>(
    "put",
    "/api/portfolio/sort",
    { data: sorts }
  );
};

/**
 * 切换作品精选状态（管理接口）
 */
export const togglePortfolioFeatured = (id: string, featured: boolean) => {
  // 后端没有单独的精选接口，需要通过更新接口实现
  return http.request<BaseResponse<Portfolio>>(
    "put",
    `/api/portfolio/${id}`,
    { data: { featured } }
  );
};
