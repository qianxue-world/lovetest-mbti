// MBTI 角色图标配置
// 每个性格类型对应一个独特的emoji角色

export const mbtiCharacters: Record<string, string> = {
  // 分析家组 (Analysts)
  'INTJ': '🧙‍♂️', // 建筑师 - 智慧的巫师
  'INTP': '🤓',   // 逻辑学家 - 思考的学者
  'ENTJ': '👔',   // 指挥官 - 商务领袖
  'ENTP': '🎭',   // 辩论家 - 戏剧面具

  // 外交家组 (Diplomats)
  'INFJ': '🦉',   // 提倡者 - 智慧的猫头鹰
  'INFP': '🦄',   // 调停者 - 梦幻独角兽
  'ENFJ': '🌟',   // 主人公 - 闪耀之星
  'ENFP': '🎨',   // 竞选者 - 创意调色板

  // 守护者组 (Sentinels)
  'ISTJ': '📋',   // 物流师 - 清单管理者
  'ISFJ': '🛡️',   // 守卫者 - 保护盾牌
  'ESTJ': '⚖️',   // 执行者 - 正义天平
  'ESFJ': '🤝',   // 执政官 - 握手合作

  // 探险家组 (Explorers)
  'ISTP': '🔧',   // 鉴赏家 - 工具大师
  'ISFP': '🎵',   // 探险家 - 音乐艺术
  'ESTP': '🏃',   // 企业家 - 行动派
  'ESFP': '🎉',   // 表演者 - 派对明星
};

// MBTI 角色颜色主题 - 莫奈风格
// NT理性者 - 紫色调（薰衣草田）
// NF理想者 - 草绿色调（睡莲池塘）
// SJ守护者 - 蓝绿色调（海景）
// SP艺术家 - 金色调（日出印象）
export const mbtiColors: Record<string, { primary: string; secondary: string; gradient: string }> = {
  // NT理性者 - 紫色调（薰衣草田、鸢尾花）
  'INTJ': { primary: '#9D7BC7', secondary: '#7B5FA8', gradient: 'linear-gradient(135deg, #B8A4D9 0%, #9D7BC7 50%, #7B5FA8 100%)' },
  'INTP': { primary: '#A88FD1', secondary: '#8B73B8', gradient: 'linear-gradient(135deg, #C4B5E3 0%, #A88FD1 50%, #8B73B8 100%)' },
  'ENTJ': { primary: '#8B6FB5', secondary: '#6F5694', gradient: 'linear-gradient(135deg, #A88FD1 0%, #8B6FB5 50%, #6F5694 100%)' },
  'ENTP': { primary: '#B39DD6', secondary: '#9D7BC7', gradient: 'linear-gradient(135deg, #D1C4E8 0%, #B39DD6 50%, #9D7BC7 100%)' },

  // NF理想者 - 草绿色调（睡莲、花园）
  'INFJ': { primary: '#7CB89D', secondary: '#5E9B7E', gradient: 'linear-gradient(135deg, #9DD4B8 0%, #7CB89D 50%, #5E9B7E 100%)' },
  'INFP': { primary: '#8BC9A8', secondary: '#6FB08C', gradient: 'linear-gradient(135deg, #A8DCC0 0%, #8BC9A8 50%, #6FB08C 100%)' },
  'ENFJ': { primary: '#6FAA8E', secondary: '#5A8F75', gradient: 'linear-gradient(135deg, #8BC9A8 0%, #6FAA8E 50%, #5A8F75 100%)' },
  'ENFP': { primary: '#9DD4B8', secondary: '#7CB89D', gradient: 'linear-gradient(135deg, #B8E6D0 0%, #9DD4B8 50%, #7CB89D 100%)' },

  // SJ守护者 - 蓝绿色调（海景、天空）
  'ISTJ': { primary: '#6B9FB8', secondary: '#5585A0', gradient: 'linear-gradient(135deg, #8BB8CF 0%, #6B9FB8 50%, #5585A0 100%)' },
  'ISFJ': { primary: '#7DADC4', secondary: '#6393AA', gradient: 'linear-gradient(135deg, #9BC5D9 0%, #7DADC4 50%, #6393AA 100%)' },
  'ESTJ': { primary: '#5A8FA8', secondary: '#477590', gradient: 'linear-gradient(135deg, #7DADC4 0%, #5A8FA8 50%, #477590 100%)' },
  'ESFJ': { primary: '#8BB8CF', secondary: '#6B9FB8', gradient: 'linear-gradient(135deg, #A8CFE3 0%, #8BB8CF 50%, #6B9FB8 100%)' },

  // SP艺术家 - 金色调（日出、麦田）
  'ISTP': { primary: '#D4A574', secondary: '#B88F5E', gradient: 'linear-gradient(135deg, #E8C9A0 0%, #D4A574 50%, #B88F5E 100%)' },
  'ISFP': { primary: '#E0B686', secondary: '#C99D6A', gradient: 'linear-gradient(135deg, #F0D4B3 0%, #E0B686 50%, #C99D6A 100%)' },
  'ESTP': { primary: '#C99D6A', secondary: '#B08554', gradient: 'linear-gradient(135deg, #E0B686 0%, #C99D6A 50%, #B08554 100%)' },
  'ESFP': { primary: '#E8C9A0', secondary: '#D4A574', gradient: 'linear-gradient(135deg, #F5E0C8 0%, #E8C9A0 50%, #D4A574 100%)' },
};

// MBTI 角色描述标签
export const mbtiTags: Record<string, string[]> = {
  'INTJ': ['战略家', '独立思考', '高效执行'],
  'INTP': ['逻辑大师', '好奇探索', '理论创新'],
  'ENTJ': ['天生领袖', '果断决策', '目标导向'],
  'ENTP': ['思维敏捷', '创新求变', '辩论高手'],
  
  'INFJ': ['理想主义', '洞察人心', '富有同情'],
  'INFP': ['真诚善良', '追求意义', '创意无限'],
  'ENFJ': ['魅力领袖', '激励他人', '和谐共处'],
  'ENFP': ['热情洋溢', '充满活力', '社交达人'],
  
  'ISTJ': ['可靠负责', '注重细节', '遵守规则'],
  'ISFJ': ['温暖体贴', '默默付出', '忠诚守护'],
  'ESTJ': ['组织能力', '实事求是', '高效管理'],
  'ESFJ': ['热心助人', '善于社交', '团队协作'],
  
  'ISTP': ['动手能力', '冷静分析', '灵活应变'],
  'ISFP': ['艺术天赋', '活在当下', '温柔敏感'],
  'ESTP': ['行动派', '冒险精神', '应变能力'],
  'ESFP': ['娱乐大师', '乐观开朗', '享受生活'],
};
