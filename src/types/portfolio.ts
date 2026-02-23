/**
 * @Description: 作品展示类型定义
 * @Author: 安知鱼
 * @Date: 2025-01-23
 */

// 作品类型枚举
export enum ProjectType {
  FRONTEND = "frontend", // 前端项目
  VIBE_CODING = "vibecoding", // VibeCoding 项目
  FULL_STACK = "fullstack", // 全栈项目
  MINIPROGRAM = "miniprogram", // 小程序
  APP = "app", // APP
  UIUX = "uiux", // UI/UX 设计
  BACKEND = "backend", // 后端项目
  DEVOPS = "devops", // DevOps
  GAME = "game", // 游戏开发
  MODEL_3D = "3d-model", // 3D 模型
  ILLUSTRATION = "illustration", // 插画作品
  OTHER = "other" // 其他
}

// 作品类型显示名称映射
export const ProjectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.FRONTEND]: "前端项目",
  [ProjectType.VIBE_CODING]: "VibeCoding",
  [ProjectType.FULL_STACK]: "全栈项目",
  [ProjectType.MINIPROGRAM]: "小程序",
  [ProjectType.APP]: "APP",
  [ProjectType.UIUX]: "UI/UX 设计",
  [ProjectType.BACKEND]: "后端项目",
  [ProjectType.DEVOPS]: "DevOps",
  [ProjectType.GAME]: "游戏开发",
  [ProjectType.MODEL_3D]: "3D 模型",
  [ProjectType.ILLUSTRATION]: "插画作品",
  [ProjectType.OTHER]: "其他"
};

// 作品状态枚举
export enum ProjectStatus {
  DEVELOPING = "developing", // 开发中
  COMPLETED = "completed", // 已完成
  ARCHIVED = "archived" // 已归档
}

// 作品状态显示名称映射
export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.DEVELOPING]: "开发中",
  [ProjectStatus.COMPLETED]: "已完成",
  [ProjectStatus.ARCHIVED]: "已归档"
};

// 作品状态颜色映射
export const ProjectStatusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.DEVELOPING]: "#e6a23c", // 橙色
  [ProjectStatus.COMPLETED]: "#67c23a", // 绿色
  [ProjectStatus.ARCHIVED]: "#909399" // 灰色
};

// 作品接口
export interface Portfolio {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  project_type: ProjectType;
  status: ProjectStatus;
  technologies: string[];
  demo_url?: string;
  github_url?: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  mode?: "light" | "dark";

  // Optional Rich Detail Fields for Portfolio Detail page
  overview?: string;
  role?: string;
  duration?: string;
  client?: string;
  challenge?: string;
  solution?: string;
  gallery_images?: string[];
}

// 获取作品列表参数
export interface GetPortfolioListParams {
  page?: number;
  pageSize?: number;
  type?: ProjectType;
  status?: ProjectStatus;
  keyword?: string;
  mode?: string;
}

// 作品列表响应
export interface PortfolioListResponse {
  list: Portfolio[];
  total: number;
}

// 统计信息接口
export interface PortfolioStats {
  total: number;
  byType: Record<ProjectType, number>;
  byStatus: Record<ProjectStatus, number>;
  topTechnologies: Array<{ name: string; count: number }>;
}
