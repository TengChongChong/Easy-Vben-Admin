export interface CaptchaVO {
  // 客户端ip+userAgent
  browserInfo?: string;
  captchaFontSize?: number;
  captchaFontType?: string;
  // 验证码id(后台申请)
  captchaId?: string;
  captchaOriginalPath?: string;
  // 验证码类型:(clickWord,blockPuzzle)
  captchaType?: string;
  // 后台二次校验参数
  captchaVerification?: string;
  // * 客户端UI组件id,组件初始化时设置一次，UUID
  clientUid?: string;
  // 滑块图片base64
  jigsawImageBase64?: string;
  // 原生图片base64
  originalImageBase64?: string;
  // 滑块点选坐标
  point?: PointVO;
  // 点选文字
  pointJson?: string;
  // 点选坐标
  pointList?: Point[];
  projectCode?: string;
  // 校验结果
  result?: boolean;
  secretKey?: string;
  // UUID(每次请求的验证码唯一标识)
  token?: string;
  // 客户端的请求时间，预留字段
  ts?: number;
  // 点选文字
  wordList?: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface PointVO extends Point {
  secretKey: string;
}
