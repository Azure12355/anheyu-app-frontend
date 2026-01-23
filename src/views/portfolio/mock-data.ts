/**
 * @Description: 作品展示页面 Mock 数据
 * @Author: 安知鱼
 * @Date: 2025-01-23
 */
import type { Portfolio, PortfolioStats } from "@/types/portfolio";
import { ProjectType, ProjectStatus } from "@/types/portfolio";

// Mock 作品数据
export const mockPortfolios: Portfolio[] = [
  // 前端项目
  {
    id: "1",
    title: "Vue3 企业级后台管理系统",
    description: "基于 Vue3 + TypeScript + Vite 构建的现代化后台管理系统，支持动态路由、权限控制、主题切换等功能。",
    cover_url: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d9f?w=800&q=80",
    project_type: ProjectType.FRONTEND,
    status: ProjectStatus.COMPLETED,
    technologies: ["Vue3", "TypeScript", "Vite", "Element Plus", "Pinia"],
    demo_url: "https://example.com/demo1",
    github_url: "https://github.com/example/project1",
    featured: true,
    sort_order: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z"
  },
  {
    id: "2",
    title: "React 18 电商平台",
    description: "使用 React 18 + Next.js 14 构建的全栈电商解决方案，包含商品管理、购物车、订单系统等核心功能。",
    cover_url: "https://images.unsplash.com/photo-1472851294608-415522f96319?w=800&q=80",
    project_type: ProjectType.FRONTEND,
    status: ProjectStatus.COMPLETED,
    technologies: ["React", "Next.js", "TailwindCSS", "Zustand", "React Query"],
    demo_url: "https://example.com/demo2",
    github_url: "https://github.com/example/project2",
    featured: true,
    sort_order: 2,
    created_at: "2024-02-10T10:00:00Z",
    updated_at: "2024-11-28T10:00:00Z"
  },
  {
    id: "3",
    title: "Three.js 3D 展厅",
    description: "基于 WebGL 的 3D 产品展示展厅，支持模型加载、材质编辑、灯光效果等，提供沉浸式浏览体验。",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    project_type: ProjectType.FRONTEND,
    status: ProjectStatus.DEVELOPING,
    technologies: ["Three.js", "Vue3", "GLSL", "Blender"],
    github_url: "https://github.com/example/project3",
    featured: false,
    sort_order: 3,
    created_at: "2024-09-01T10:00:00Z",
    updated_at: "2024-12-20T10:00:00Z"
  },
  {
    id: "4",
    title: "Nuxt.js SSR 博客系统",
    description: "支持 SSR 渲染的个人博客系统，优化 SEO，提供 Markdown 编辑、代码高亮、评论系统等功能。",
    cover_url: "https://images.unsplash.com/photo-1499750310159-5420f763a887?w=800&q=80",
    project_type: ProjectType.FRONTEND,
    status: ProjectStatus.COMPLETED,
    technologies: ["Nuxt.js", "Vue3", "TypeScript", "MDX", "Vercel"],
    demo_url: "https://example.com/demo4",
    github_url: "https://github.com/example/project4",
    featured: false,
    sort_order: 4,
    created_at: "2024-03-05T10:00:00Z",
    updated_at: "2024-10-15T10:00:00Z"
  },
  {
    id: "5",
    title: "Angular 组件库",
    description: "企业级 Angular 组件库，包含 50+ 高质量组件，支持主题定制、按需加载、国际化等功能。",
    cover_url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    project_type: ProjectType.FRONTEND,
    status: ProjectStatus.COMPLETED,
    technologies: ["Angular", "TypeScript", "SCSS", "Storybook"],
    demo_url: "https://example.com/demo5",
    github_url: "https://github.com/example/project5",
    featured: false,
    sort_order: 5,
    created_at: "2024-04-20T10:00:00Z",
    updated_at: "2024-11-30T10:00:00Z"
  },
  // VibeCoding 项目
  {
    id: "6",
    title: "AI 代码助手",
    description: "基于大语言模型的智能代码补全工具，支持多种编程语言，提供代码解释、重构建议等功能。",
    cover_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    project_type: ProjectType.VIBE_CODING,
    status: ProjectStatus.COMPLETED,
    technologies: ["Python", "FastAPI", "Vue3", "OpenAI API", "WebSocket"],
    demo_url: "https://example.com/demo6",
    github_url: "https://github.com/example/project6",
    featured: true,
    sort_order: 6,
    created_at: "2024-05-15T10:00:00Z",
    updated_at: "2024-12-10T10:00:00Z"
  },
  {
    id: "7",
    title: "代码审查机器人",
    description: "自动化代码审查工具，集成 ESLint、Prettier，支持 Git Hook，提供代码质量报告和改进建议。",
    cover_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    project_type: ProjectType.VIBE_CODING,
    status: ProjectStatus.DEVELOPING,
    technologies: ["Node.js", "TypeScript", "Git", "Docker", "GitHub API"],
    github_url: "https://github.com/example/project7",
    featured: false,
    sort_order: 7,
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-12-22T10:00:00Z"
  },
  {
    id: "8",
    title: "智能部署平台",
    description: "一键部署工具，支持多种云服务商，提供 CI/CD 流程、环境配置、日志监控等功能。",
    cover_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    project_type: ProjectType.VIBE_CODING,
    status: ProjectStatus.COMPLETED,
    technologies: ["Go", "Kubernetes", "Docker", "Terraform", "AWS"],
    demo_url: "https://example.com/demo8",
    github_url: "https://github.com/example/project8",
    featured: false,
    sort_order: 8,
    created_at: "2024-06-10T10:00:00Z",
    updated_at: "2024-11-25T10:00:00Z"
  },
  // 全栈项目
  {
    id: "9",
    title: "在线协作白板",
    description: "实时协作白板应用，支持多人同时绘图、文字输入、文件共享，使用 WebSocket 实现实时同步。",
    cover_url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
    project_type: ProjectType.FULL_STACK,
    status: ProjectStatus.COMPLETED,
    technologies: ["Vue3", "Node.js", "Socket.io", "MongoDB", "Redis"],
    demo_url: "https://example.com/demo9",
    github_url: "https://github.com/example/project9",
    featured: true,
    sort_order: 9,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-12-05T10:00:00Z"
  },
  {
    id: "10",
    title: "任务管理系统",
    description: "企业级任务管理平台，包含项目管理、任务分配、进度跟踪、团队协作等功能。",
    cover_url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    project_type: ProjectType.FULL_STACK,
    status: ProjectStatus.COMPLETED,
    technologies: ["React", "NestJS", "PostgreSQL", "Docker", "Jest"],
    demo_url: "https://example.com/demo10",
    github_url: "https://github.com/example/project10",
    featured: false,
    sort_order: 10,
    created_at: "2024-02-25T10:00:00Z",
    updated_at: "2024-11-20T10:00:00Z"
  },
  {
    id: "11",
    title: "即时通讯应用",
    description: "支持文字、语音、视频聊天的即时通讯应用，端到端加密，支持群组、文件传输等功能。",
    cover_url: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&q=80",
    project_type: ProjectType.FULL_STACK,
    status: ProjectStatus.DEVELOPING,
    technologies: ["Vue3", "Go", "WebRTC", "MongoDB", "Redis"],
    github_url: "https://github.com/example/project11",
    featured: false,
    sort_order: 11,
    created_at: "2024-11-01T10:00:00Z",
    updated_at: "2024-12-18T10:00:00Z"
  },
  {
    id: "12",
    title: "在线编程教育平台",
    description: "提供编程课程、在线编程练习、代码评审等功能的综合教育平台，支持多种编程语言。",
    cover_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    project_type: ProjectType.FULL_STACK,
    status: ProjectStatus.COMPLETED,
    technologies: ["Next.js", "Django", "PostgreSQL", "Docker", "FFmpeg"],
    demo_url: "https://example.com/demo12",
    github_url: "https://github.com/example/project12",
    featured: false,
    sort_order: 12,
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-10-30T10:00:00Z"
  },
  // 小程序
  {
    id: "13",
    title: "点餐小程序",
    description: "微信小程序点餐系统，支持菜单展示、在线下单、支付、订单跟踪等功能。",
    cover_url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80",
    project_type: ProjectType.MINIPROGRAM,
    status: ProjectStatus.COMPLETED,
    technologies: ["微信小程序", "Vue3", "Node.js", "MongoDB", "微信支付"],
    featured: true,
    sort_order: 13,
    created_at: "2024-04-01T10:00:00Z",
    updated_at: "2024-12-12T10:00:00Z"
  },
  {
    id: "14",
    title: "电商购物小程序",
    description: "完整的电商购物小程序，包含商品展示、购物车、订单管理、优惠券等功能。",
    cover_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    project_type: ProjectType.MINIPROGRAM,
    status: ProjectStatus.COMPLETED,
    technologies: ["uniapp", "Vue3", "Spring Boot", "MySQL"],
    demo_url: "https://example.com/demo14",
    github_url: "https://github.com/example/project14",
    featured: false,
    sort_order: 14,
    created_at: "2024-05-20T10:00:00Z",
    updated_at: "2024-11-15T10:00:00Z"
  },
  {
    id: "15",
    title: "社区服务小程序",
    description: "社区便民服务小程序，包含物业缴费、报修、社区公告、二手交易等功能。",
    cover_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    project_type: ProjectType.MINIPROGRAM,
    status: ProjectStatus.DEVELOPING,
    technologies: ["支付宝小程序", "React", "Node.js", "MySQL"],
    github_url: "https://github.com/example/project15",
    featured: false,
    sort_order: 15,
    created_at: "2024-11-15T10:00:00Z",
    updated_at: "2024-12-25T10:00:00Z"
  },
  {
    id: "16",
    title: "健身打卡小程序",
    description: "健身运动打卡小程序，支持运动记录、数据统计、社交分享、成就系统等功能。",
    cover_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    project_type: ProjectType.MINIPROGRAM,
    status: ProjectStatus.ARCHIVED,
    technologies: ["抖音小程序", "Vue3", "Go"],
    featured: false,
    sort_order: 16,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-06-30T10:00:00Z"
  },
  // APP
  {
    id: "17",
    title: "跨平台任务管理 APP",
    description: "使用 Flutter 开发的跨平台任务管理应用，支持 iOS 和 Android，提供离线同步、推送通知等功能。",
    cover_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    project_type: ProjectType.APP,
    status: ProjectStatus.COMPLETED,
    technologies: ["Flutter", "Dart", "Firebase", "SQLite"],
    demo_url: "https://example.com/demo17",
    github_url: "https://github.com/example/project17",
    featured: true,
    sort_order: 17,
    created_at: "2024-02-15T10:00:00Z",
    updated_at: "2024-11-10T10:00:00Z"
  },
  {
    id: "18",
    title: "音乐播放器 APP",
    description: "Android 音乐播放器，支持本地音乐、在线音乐、歌词显示、均衡器等功能。",
    cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    project_type: ProjectType.APP,
    status: ProjectStatus.COMPLETED,
    technologies: ["Kotlin", "Jetpack Compose", "ExoPlayer", "Room"],
    demo_url: "https://example.com/demo18",
    github_url: "https://github.com/example/project18",
    featured: false,
    sort_order: 18,
    created_at: "2024-03-25T10:00:00Z",
    updated_at: "2024-10-20T10:00:00Z"
  },
  {
    id: "19",
    title: "智能家居控制 APP",
    description: "智能家居控制中心，支持设备管理、场景自动化、语音控制、远程监控等功能。",
    cover_url: "https://images.unsplash.com/photo-1558002038-1091a166111c?w=800&q=80",
    project_type: ProjectType.APP,
    status: ProjectStatus.DEVELOPING,
    technologies: ["React Native", "TypeScript", "MQTT", "Node.js"],
    github_url: "https://github.com/example/project19",
    featured: false,
    sort_order: 19,
    created_at: "2024-10-20T10:00:00Z",
    updated_at: "2024-12-23T10:00:00Z"
  },
  {
    id: "20",
    title: "记账理财 APP",
    description: "个人理财记账应用，支持收支记录、分类统计、预算管理、数据导出等功能。",
    cover_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    project_type: ProjectType.APP,
    status: ProjectStatus.COMPLETED,
    technologies: ["Swift", "SwiftUI", "CoreData", "Chart.js"],
    demo_url: "https://example.com/demo20",
    github_url: "https://github.com/example/project20",
    featured: false,
    sort_order: 20,
    created_at: "2024-04-10T10:00:00Z",
    updated_at: "2024-09-25T10:00:00Z"
  },
  // 其他
  {
    id: "21",
    title: "游戏辅助工具集",
    description: "多款游戏辅助工具的合集，包括 DPS 计算器、地图标记、团队管理等实用功能。",
    cover_url: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    project_type: ProjectType.OTHER,
    status: ProjectStatus.COMPLETED,
    technologies: ["Electron", "Vue3", "Python"],
    demo_url: "https://example.com/demo21",
    github_url: "https://github.com/example/project21",
    featured: false,
    sort_order: 21,
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-08-20T10:00:00Z"
  },
  {
    id: "22",
    title: "命令行工具集",
    description: "提升开发效率的命令行工具集，包含文件处理、代码生成、部署脚本等工具。",
    cover_url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    project_type: ProjectType.OTHER,
    status: ProjectStatus.COMPLETED,
    technologies: ["Go", "Shell", "Docker"],
    github_url: "https://github.com/example/project22",
    featured: false,
    sort_order: 22,
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-07-15T10:00:00Z"
  },
  {
    id: "23",
    title: "浏览器插件合集",
    description: "提升浏览器使用体验的插件合集，包括广告拦截、密码管理、截图工具等。",
    cover_url: "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?w=800&q=80",
    project_type: ProjectType.OTHER,
    status: ProjectStatus.ARCHIVED,
    technologies: ["JavaScript", "Chrome Extension API", "Vue3"],
    featured: false,
    sort_order: 23,
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-05-30T10:00:00Z"
  },
  {
    id: "24",
    title: "自动化测试框架",
    description: "基于 Playwright 的端到端自动化测试框架，支持视觉回归测试、API 测试、性能测试。",
    cover_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    project_type: ProjectType.OTHER,
    status: ProjectStatus.DEVELOPING,
    technologies: ["TypeScript", "Playwright", "Jest", "Docker"],
    github_url: "https://github.com/example/project24",
    featured: false,
    sort_order: 24,
    created_at: "2024-11-10T10:00:00Z",
    updated_at: "2024-12-28T10:00:00Z"
  },
  // 更多前端项目
  {
    id: "25",
    title: "SvelteKit 个人网站",
    description: "使用 SvelteKit 构建的高性能个人网站，极致优化首屏加载速度和 SEO。",
    cover_url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    project_type: ProjectType.FRONTEND,
    status: ProjectStatus.COMPLETED,
    technologies: ["SvelteKit", "Svelte", "TypeScript", "Vite"],
    demo_url: "https://example.com/demo25",
    github_url: "https://github.com/example/project25",
    featured: false,
    sort_order: 25,
    created_at: "2024-06-05T10:00:00Z",
    updated_at: "2024-11-05T10:00:00Z"
  },
  {
    id: "26",
    title: "SolidJS 组件库",
    description: "超高性能的 SolidJS 组件库，专为响应式应用设计，提供细粒度响应式更新。",
    cover_url: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
    project_type: ProjectType.FRONTEND,
    status: ProjectStatus.DEVELOPING,
    technologies: ["SolidJS", "TypeScript", "TailwindCSS", "Vite"],
    github_url: "https://github.com/example/project26",
    featured: false,
    sort_order: 26,
    created_at: "2024-10-05T10:00:00Z",
    updated_at: "2024-12-15T10:00:00Z"
  }
];

// Mock 统计数据
export const mockStats: PortfolioStats = {
  total: 26,
  byType: {
    [ProjectType.FRONTEND]: 7,
    [ProjectType.VIBE_CODING]: 3,
    [ProjectType.FULL_STACK]: 4,
    [ProjectType.MINIPROGRAM]: 4,
    [ProjectType.APP]: 4,
    [ProjectType.OTHER]: 4
  },
  byStatus: {
    [ProjectStatus.DEVELOPING]: 6,
    [ProjectStatus.COMPLETED]: 17,
    [ProjectStatus.ARCHIVED]: 3
  },
  topTechnologies: [
    { name: "Vue3", count: 12 },
    { name: "TypeScript", count: 10 },
    { name: "React", count: 5 },
    { name: "Node.js", count: 5 },
    { name: "Go", count: 3 },
    { name: "Python", count: 2 },
    { name: "Docker", count: 4 },
    { name: "Vite", count: 4 }
  ]
};

// 模拟 API 调用的延迟
export const mockDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));

// 模拟获取作品列表
export const mockGetPortfolios = async (params?: {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
  keyword?: string;
  mode?: string;
}) => {
  await mockDelay();

  // Dynamically assign mode based on ID parity for consistency
  let filteredList = mockPortfolios.map(p => ({
    ...p,
    mode: p.mode || (parseInt(p.id) % 2 === 0 ? 'dark' : 'light') as 'light' | 'dark'
  }));

  // 按类型筛选
  if (params?.type && params.type !== "all") {
    filteredList = filteredList.filter(p => p.project_type === params.type);
  }

  // 按状态筛选
  if (params?.status && params.status !== "all") {
    filteredList = filteredList.filter(p => p.status === params.status);
  }

  // Filter by mode
  if (params?.mode && params.mode !== "all") {
    filteredList = filteredList.filter(p => p.mode === params.mode);
  }

  // 按关键词搜索
  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredList = filteredList.filter(
      p =>
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.technologies.some(t => t.toLowerCase().includes(keyword))
    );
  }

  // 分页
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 12;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedList = filteredList.slice(start, end);

  return {
    code: 200,
    message: "success",
    data: {
      list: paginatedList,
      total: filteredList.length
    }
  };
};

// 模拟获取统计数据
export const mockGetStats = async () => {
  await mockDelay();
  return {
    code: 200,
    message: "success",
    data: mockStats
  };
};
