import { SiteCategory } from './types';

const DEFAULT_RULES: Record<string, SiteCategory> = {
    // === WORK & DEV ===
    'github.com': SiteCategory.WORK,
    'stackoverflow.com': SiteCategory.WORK,
    'gitlab.com': SiteCategory.WORK,
    'linkedin.com': SiteCategory.WORK,
    'google.com': SiteCategory.WORK,
    'docs.google.com': SiteCategory.WORK,
    'notion.so': SiteCategory.WORK,
    'linear.app': SiteCategory.WORK,
    'figma.com': SiteCategory.WORK,
    'canva.com': SiteCategory.WORK,
    'dribbble.com': SiteCategory.WORK,
    'behance.net': SiteCategory.WORK,
    'trello.com': SiteCategory.WORK,
    'asana.com': SiteCategory.WORK,
    'jira.com': SiteCategory.WORK,
    'atlassian.com': SiteCategory.WORK,
    'slack.com': SiteCategory.WORK,
    'discord.com': SiteCategory.WORK,
    'zoom.us': SiteCategory.WORK,
    'microsoft.com': SiteCategory.WORK,
    'office.com': SiteCategory.WORK,
    'vercel.com': SiteCategory.WORK,
    'netlify.com': SiteCategory.WORK,
    'aws.amazon.com': SiteCategory.WORK,
    'aliyun.com': SiteCategory.WORK,
    'tencent.com': SiteCategory.WORK,
    'csdn.net': SiteCategory.WORK,
    'juejin.cn': SiteCategory.WORK,
    'jianshu.com': SiteCategory.WORK,
    'cnblogs.com': SiteCategory.WORK,
    'segmentfault.com': SiteCategory.WORK,
    'gitee.com': SiteCategory.WORK,

    // === LEARNING ===
    'wikipedia.org': SiteCategory.LEARNING,
    'coursera.org': SiteCategory.LEARNING,
    'udemy.com': SiteCategory.LEARNING,
    'edx.org': SiteCategory.LEARNING,

    // === PRODUCTIVITY & TOOLS ===
    'baidu.com': SiteCategory.PRODUCTIVITY,
    'bing.com': SiteCategory.PRODUCTIVITY,
    'yahoo.com': SiteCategory.PRODUCTIVITY,
    'duckduckgo.com': SiteCategory.PRODUCTIVITY,
    'wolframalpha.com': SiteCategory.PRODUCTIVITY,
    'deepl.com': SiteCategory.PRODUCTIVITY,
    'translate.google.com': SiteCategory.PRODUCTIVITY,
    'fanyi.baidu.com': SiteCategory.PRODUCTIVITY,
    'speedtest.net': SiteCategory.PRODUCTIVITY,

    // === AI TOOLS ===
    // Global
    'chatgpt.com': SiteCategory.AI,
    'openai.com': SiteCategory.AI,
    'claude.ai': SiteCategory.AI,
    'anthropic.com': SiteCategory.AI,
    'gemini.google.com': SiteCategory.AI,
    'deepmind.google': SiteCategory.AI,
    'bard.google.com': SiteCategory.AI,
    'midjourney.com': SiteCategory.AI,
    'huggingface.co': SiteCategory.AI,
    'poe.com': SiteCategory.AI,
    'perplexity.ai': SiteCategory.AI,
    'civitai.com': SiteCategory.AI,
    'v0.dev': SiteCategory.AI,
    'cursor.com': SiteCategory.AI,
    'cursor.sh': SiteCategory.AI,
    'khily.com': SiteCategory.AI,
    'monica.im': SiteCategory.AI,
    'jasper.ai': SiteCategory.AI,
    'copy.ai': SiteCategory.AI,
    'notion.ai': SiteCategory.AI,
    'github.com/copilot': SiteCategory.AI,
    // Chinese
    'bigmodel.cn': SiteCategory.AI,
    'chatglm.cn': SiteCategory.AI,
    'minimax.io': SiteCategory.AI,
    'minimaxi.com': SiteCategory.AI,
    'moonshot.cn': SiteCategory.AI,
    'kimi.moonshot.cn': SiteCategory.AI,
    'doubao.com': SiteCategory.AI,
    'yiyan.baidu.com': SiteCategory.AI,
    'hunyuan.tencent.com': SiteCategory.AI,
    'tongyi.aliyun.com': SiteCategory.AI,
    'baichuan-ai.com': SiteCategory.AI,
    'sensenova.cn': SiteCategory.AI,
    '01.ai': SiteCategory.AI,
    'metaso.cn': SiteCategory.AI,
    'tiangong.cn': SiteCategory.AI,
    'deepseek.com': SiteCategory.AI,

    // === ENTERTAINMENT & VIDEO ===
    'youtube.com': SiteCategory.ENTERTAINMENT,
    'netflix.com': SiteCategory.ENTERTAINMENT,
    'bilibili.com': SiteCategory.ENTERTAINMENT,
    'www.bilibili.com': SiteCategory.ENTERTAINMENT,
    'twitch.tv': SiteCategory.ENTERTAINMENT,
    'spotify.com': SiteCategory.ENTERTAINMENT,
    'youku.com': SiteCategory.ENTERTAINMENT,
    'iqiyi.com': SiteCategory.ENTERTAINMENT,
    'v.qq.com': SiteCategory.ENTERTAINMENT,
    'mgtv.com': SiteCategory.ENTERTAINMENT,
    'hulu.com': SiteCategory.ENTERTAINMENT,
    'disneyplus.com': SiteCategory.ENTERTAINMENT,
    'hbo.com': SiteCategory.ENTERTAINMENT,
    'primevideo.com': SiteCategory.ENTERTAINMENT,
    'steamcommunity.com': SiteCategory.ENTERTAINMENT,
    'steampowered.com': SiteCategory.ENTERTAINMENT,
    'epicgames.com': SiteCategory.ENTERTAINMENT,
    'roblox.com': SiteCategory.ENTERTAINMENT,
    'poki.com': SiteCategory.ENTERTAINMENT,
    '4399.com': SiteCategory.ENTERTAINMENT,
    'douyu.com': SiteCategory.ENTERTAINMENT,
    'huya.com': SiteCategory.ENTERTAINMENT,

    // === SOCIAL & COMMUNITY ===
    'twitter.com': SiteCategory.SOCIAL,
    'x.com': SiteCategory.SOCIAL,
    'facebook.com': SiteCategory.SOCIAL,
    'instagram.com': SiteCategory.SOCIAL,
    'reddit.com': SiteCategory.SOCIAL,
    'weibo.com': SiteCategory.SOCIAL,
    'zhihu.com': SiteCategory.SOCIAL,
    'quora.com': SiteCategory.SOCIAL,
    'v2ex.com': SiteCategory.SOCIAL,
    'tiktok.com': SiteCategory.SOCIAL,
    'douyin.com': SiteCategory.SOCIAL,
    'kuaishou.com': SiteCategory.SOCIAL,
    'xiaohongshu.com': SiteCategory.SOCIAL,
    'tieba.baidu.com': SiteCategory.SOCIAL,
    'wx.qq.com': SiteCategory.SOCIAL,
    'wechat.com': SiteCategory.SOCIAL,
    'whatsapp.com': SiteCategory.SOCIAL,
    'telegram.org': SiteCategory.SOCIAL,
    'messenger.com': SiteCategory.SOCIAL,
    'tumblr.com': SiteCategory.SOCIAL,
    'pinterest.com': SiteCategory.SOCIAL,
    'snapchat.com': SiteCategory.SOCIAL,

    // === SHOPPING ===
    'amazon.com': SiteCategory.SHOPPING,
    'taobao.com': SiteCategory.SHOPPING,
    'jd.com': SiteCategory.SHOPPING,
    'pinduoduo.com': SiteCategory.SHOPPING,
    'tmall.com': SiteCategory.SHOPPING,
    '1688.com': SiteCategory.SHOPPING,
    'ebay.com': SiteCategory.SHOPPING,
    'walmart.com': SiteCategory.SHOPPING,
    'bestbuy.com': SiteCategory.SHOPPING,
    'target.com': SiteCategory.SHOPPING,
    'aliexpress.com': SiteCategory.SHOPPING,
    'etsy.com': SiteCategory.SHOPPING,
    'paypal.com': SiteCategory.SHOPPING,

    // === NEWS ===
    'cnn.com': SiteCategory.NEWS,
    'bbc.com': SiteCategory.NEWS,
    'nytimes.com': SiteCategory.NEWS,
    'toutiao.com': SiteCategory.NEWS,
    '163.com': SiteCategory.NEWS,
    'qq.com': SiteCategory.NEWS,
    'sina.com.cn': SiteCategory.NEWS,
    'sohu.com': SiteCategory.NEWS,
    'ifeng.com': SiteCategory.NEWS,
    'thepaper.cn': SiteCategory.NEWS,
    'xinhuanet.com': SiteCategory.NEWS,
    'huanqiu.com': SiteCategory.NEWS,
    'wsj.com': SiteCategory.NEWS,
    'bloomberg.com': SiteCategory.NEWS,
    'reuters.com': SiteCategory.NEWS,
    'washingtonpost.com': SiteCategory.NEWS,
    'theguardian.com': SiteCategory.NEWS,
    'medium.com': SiteCategory.NEWS,
    'news.ycombinator.com': SiteCategory.NEWS,
};

export class SiteCategorizer {
    private static customRules: Record<string, SiteCategory> = {};

    static loadCustomRules(rules: Record<string, SiteCategory>) {
        this.customRules = rules;
    }

    static categorize(domain: string): SiteCategory {
        // 1. Check Custom Rules first
        if (this.customRules[domain]) {
            return this.customRules[domain];
        }

        // 2. Exact match (Default Rules)
        if (DEFAULT_RULES[domain]) {
            return DEFAULT_RULES[domain];
        }

        // 3. Subdomain check (e.g. mail.google.com -> google.com)
        const parts = domain.split('.');
        if (parts.length > 2) {
            const rootDomain = parts.slice(parts.length - 2).join('.');
            // Check custom rules for root domain
            if (this.customRules[rootDomain]) {
                return this.customRules[rootDomain];
            }
            // Check default rules for root domain
            if (DEFAULT_RULES[rootDomain]) {
                return DEFAULT_RULES[rootDomain];
            }
        }

        return SiteCategory.OTHER;
    }
}
