export interface ReportTemplate {
  id: string;
  name: string;
  format: string;
}

const STORAGE_KEY = 'dailyReportTemplates';
const SELECTED_KEY = 'dailyReportSelectedTemplateId';

// 削除不可のデフォルトテンプレート。一覧が空になることを防ぐための番兵でもある。
export const DEFAULT_TEMPLATE: ReportTemplate = {
  id: 'default',
  name: 'デフォルト',
  format: `業務内容: (活動内容を簡潔にまとめる)
成果: (達成したことや得られた結果)
課題: (問題点や改善点)
今後の予定: (次に取り組むこと)`,
};

export function loadTemplates(): ReportTemplate[] {
  if (typeof window === 'undefined') return [DEFAULT_TEMPLATE];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [DEFAULT_TEMPLATE];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [DEFAULT_TEMPLATE];
    return parsed as ReportTemplate[];
  } catch {
    return [DEFAULT_TEMPLATE];
  }
}

export function saveTemplates(templates: ReportTemplate[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function loadSelectedTemplateId(): string {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATE.id;
  return window.localStorage.getItem(SELECTED_KEY) || DEFAULT_TEMPLATE.id;
}

export function saveSelectedTemplateId(id: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SELECTED_KEY, id);
}
