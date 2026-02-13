import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { StorageManager } from '../../lib/storage';
import { AIClient } from '../../lib/ai/client';
import { PromptGenerator } from '../../lib/ai/prompt';
import type { SiteVisit } from '../../lib/types';

interface AIInsightsProps {
    sessions: SiteVisit[];
    productivityScore: number;
}

export default function AIInsights({ sessions, productivityScore }: AIInsightsProps) {
    const { t, i18n } = useTranslation();
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasKey, setHasKey] = useState(false);

    useEffect(() => {
        checkSettings();
        loadCachedInsight();
    }, []);

    const checkSettings = async () => {
        const settings = await StorageManager.getAISettings();
        setHasKey(!!settings.apiKey);
    };

    const loadCachedInsight = async () => {
        const date = new Date().toISOString().split('T')[0];
        const key = `insight_${date}`;
        const result = await chrome.storage.local.get(key);
        if (result[key]) {
            setInsight(result[key] as string);
        }
    };

    const generateInsight = async () => {
        setLoading(true);
        setError(null);
        try {
            const settings = await StorageManager.getAISettings();
            if (!settings.apiKey) {
                setHasKey(false);
                throw new Error(t('dashboard.ai.no_key'));
            }

            const prompt = PromptGenerator.generateInsightPrompt(sessions, productivityScore, i18n.language);
            const response = await AIClient.callLLM(prompt, settings);

            setInsight(response);

            // Cache result
            const date = new Date().toISOString().split('T')[0];
            await chrome.storage.local.set({ [`insight_${date}`]: response });

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to generate insight');
        } finally {
            setLoading(false);
        }
    };

    if (!hasKey) {
        return (
            <div className="h-full bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-6 transition-all hover:border-indigo-300 hover:bg-slate-50/80 group">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🤖</span>
                </div>
                <h3 className="font-semibold text-slate-700 mb-2">{t('dashboard.ai.title')}</h3>
                <p className="text-xs text-slate-500 mb-5 max-w-[200px] leading-relaxed">{t('dashboard.ai.setup_desc')}</p>
                <button
                    className="px-5 py-2 bg-white text-indigo-600 text-xs font-semibold rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
                    onClick={() => alert(t('dashboard.ai.open_popup_hint'))}
                >
                    {t('dashboard.ai.configure')}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full relative group">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-indigo-50/30 to-purple-50/30">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">✨</span>
                    <h3 className="font-semibold text-slate-700 text-sm">{t('dashboard.ai.daily_insight')}</h3>
                </div>
                <button
                    onClick={generateInsight}
                    disabled={loading}
                    className="text-[10px] px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 shadow-sm"
                >
                    {loading ? t('dashboard.ai.analyzing') : (insight ? t('dashboard.ai.regenerate') : t('dashboard.ai.generate'))}
                </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-xs animate-pulse font-medium">{t('dashboard.ai.thinking')}</p>
                    </div>
                ) : error ? (
                    <div className="text-rose-500 text-xs p-3 bg-rose-50 rounded-lg border border-rose-100 leading-relaxed">
                        {error}
                    </div>
                ) : insight ? (
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-normal">
                        <ReactMarkdown>{insight}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <span className="text-3xl mb-3 opacity-30 grayscale">🦉</span>
                        <p className="text-xs text-center max-w-[180px] leading-relaxed">{t('dashboard.ai.placeholder')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
