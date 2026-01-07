'use client';

import React, { useRef } from 'react';
import { useData } from './DataProvider';

interface BackupData {
  version: string;
  exportedAt: string;
  data: {
    members: any[];
    songs: any[];
    events: any[];
    setlists: any[];
  };
}

export function BackupPanel() {
  const { members, songs, events, setlists } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      console.log('Exporting data...');
      const response = await fetch('/api/export');
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const backup: BackupData = await response.json();
      
      // Create a blob and download
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hatobito-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Export completed');
      alert('データをエクスポートしました');
    } catch (error) {
      console.error('Export error:', error);
      alert('エクスポートに失敗しました');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('Importing file:', file.name);
      const fileContent = await file.text();
      const backup: BackupData = JSON.parse(fileContent);
      
      // Validate backup structure
      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup file format');
      }
      
      console.log('Sending import request...');
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backup)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to import data');
      }
      
      const result = await response.json();
      console.log('Import completed:', result);
      
      // Reload the page to refresh all data
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      alert(`インポートに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white rounded-lg shadow-sm p-6 border border-purple-100">
      <h3 className="text-lg font-bold text-purple-700 mb-4">💾 バックアップ & 復元</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Export Section */}
        <div className="bg-white border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-3">データをエクスポート</h4>
          <p className="text-sm text-gray-600 mb-4">
            現在のすべてのデータをJSON形式でダウンロードします。
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-4">
            <div className="text-xs text-gray-600">
              <div>メンバー: {members.length}件</div>
              <div>楽曲: {songs.length}件</div>
              <div>イベント: {events.length}件</div>
              <div>セットリスト: {setlists.length}件</div>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition"
          >
            ダウンロード
          </button>
        </div>

        {/* Import Section */}
        <div className="bg-white border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-3">データをインポート</h4>
          <p className="text-sm text-gray-600 mb-4">
            以前ダウンロードしたバックアップファイルを復元します。
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <p className="text-xs text-yellow-800">
              ⚠️ インポートすると現在のデータに追加されます。
            </p>
          </div>
          <label className="w-full block">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition"
            >
              ファイルを選択
            </button>
          </label>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
        <p>💡 ヒント: Vercelへのデプロイ時にデータがリセットされた場合、このバックアップファイルから簡単に復元できます。</p>
      </div>
    </div>
  );
}
