'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_TEMPLATE,
  ReportTemplate,
  loadSelectedTemplateId,
  loadTemplates,
  saveSelectedTemplateId,
  saveTemplates,
} from './lib/templates';

export default function Home() {
  const [activities, setActivities] = useState('');
  const [report, setReport] = useState('');
  const [editedReport, setEditedReport] = useState('');
  const [loading, setLoading] = useState(false);

  const [templates, setTemplates] = useState<ReportTemplate[]>([DEFAULT_TEMPLATE]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATE.id);
  const [manageOpen, setManageOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formFormat, setFormFormat] = useState('');

  useEffect(() => {
    setTemplates(loadTemplates());
    setSelectedTemplateId(loadSelectedTemplateId());
  }, []);

  const selectedTemplate =
    templates.find((t) => t.id === selectedTemplateId) || DEFAULT_TEMPLATE;

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    saveSelectedTemplateId(id);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName('');
    setFormFormat('');
  };

  const handleStartEdit = (template: ReportTemplate) => {
    setEditingId(template.id);
    setFormName(template.name);
    setFormFormat(template.format);
  };

  const handleSaveTemplate = () => {
    if (!formName.trim() || !formFormat.trim()) {
      alert('テンプレート名とフォーマットを入力してください');
      return;
    }

    let next: ReportTemplate[];
    if (editingId) {
      next = templates.map((t) =>
        t.id === editingId ? { ...t, name: formName, format: formFormat } : t
      );
    } else {
      const newTemplate: ReportTemplate = {
        id: `${Date.now()}`,
        name: formName,
        format: formFormat,
      };
      next = [...templates, newTemplate];
    }

    setTemplates(next);
    saveTemplates(next);
    resetForm();
  };

  const handleDeleteTemplate = (id: string) => {
    if (id === DEFAULT_TEMPLATE.id) {
      alert('デフォルトテンプレートは削除できません');
      return;
    }
    if (!confirm('このテンプレートを削除しますか？')) return;

    const next = templates.filter((t) => t.id !== id);
    setTemplates(next);
    saveTemplates(next);

    if (selectedTemplateId === id) {
      handleSelectTemplate(DEFAULT_TEMPLATE.id);
    }
    if (editingId === id) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting activities:', activities);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activities, format: selectedTemplate.format }),
      });

      console.log('API response status:', response.status);
      console.log('API response headers:', Array.from(response.headers.entries()));

      let data: any;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Response is not JSON:', text);
        data = { error: text || '非JSONレスポンスを受信しました' };
      }

      console.log('API response body:', data);

      if (!response.ok) {
        console.error('API returned an error:', data);
        alert(`エラーが発生しました: ${data.error || response.statusText}`);
      } else {
        setReport(data.report);
        setEditedReport(data.report);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('通信エラーが発生しました。コンソールを確認してください。');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">AI日報生成アプリ</h1>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="template" className="block text-gray-700 font-medium">
              テンプレート
            </label>
            <button
              type="button"
              onClick={() => setManageOpen((v) => !v)}
              className="text-sm text-blue-600 hover:underline"
            >
              {manageOpen ? '閉じる' : 'テンプレートを管理'}
            </button>
          </div>
          <select
            id="template"
            value={selectedTemplateId}
            onChange={(e) => handleSelectTemplate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="relative mt-2">
            <button
              type="button"
              onClick={() => setPreviewOpen((v) => !v)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              テンプレートを表示 ▾
            </button>
            {previewOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPreviewOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1 z-20 w-full p-3 border border-gray-200 rounded-md bg-white shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">{selectedTemplate.name}</p>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
                    {selectedTemplate.format}
                  </pre>
                </div>
              </>
            )}
          </div>

          {manageOpen && (
            <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
              <ul className="mb-3 space-y-1">
                {templates.map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-sm">
                    <span>{t.name}</span>
                    <span className="space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(t)}
                        className="text-blue-600 hover:underline"
                      >
                        編集
                      </button>
                      {t.id !== DEFAULT_TEMPLATE.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(t.id)}
                          className="text-red-600 hover:underline"
                        >
                          削除
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="テンプレート名"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <textarea
                  placeholder="フォーマット（例: 業務内容: ...\n成果: ...）"
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value)}
                  rows={4}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-mono"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    className="flex-1 bg-blue-500 text-white py-1 rounded-md text-sm hover:bg-blue-600"
                  >
                    {editingId ? '更新' : '追加'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 text-gray-700 py-1 rounded-md text-sm hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="activities" className="block text-gray-700 font-medium mb-2">
              今日やったことを入力してください
            </label>
            <textarea
              id="activities"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '生成中...' : '日報生成'}
          </button>
        </form>
        {report && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">生成された日報</h2>
            <textarea
              value={editedReport}
              onChange={(e) => setEditedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans text-sm"
              rows={12}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(editedReport);
                alert('日報をコピーしました');
              }}
              className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              コピー
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
