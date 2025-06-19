import React from 'react';
import { format } from 'date-fns';
import ja from 'date-fns/locale/ja';

export default function TaskDetail({ task, onEdit, onDelete }) {
  // 日付のフォーマット関数
  const formatDate = (dateString) => {
    if (!dateString) return '未設定';
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日 (eee)', { locale: ja });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* タスクヘッダー */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            編集
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            削除
          </button>
        </div>
      </div>

      {/* タスク内容 */}
      <div 
        className="bg-white rounded-lg p-4 mb-4 border border-gray-200 whitespace-pre-wrap"
        style={{ backgroundColor: task.color || '#fffacd' }}
      >
        {task.content || <span className="text-gray-500 italic">内容なし</span>}
      </div>

      {/* タスク情報 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600">開始日</h3>
          <p>{formatDate(task.start_date)}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600">終了日</h3>
          <p>{formatDate(task.end_date)}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600">ステータス</h3>
          <p className="flex items-center">
            {task.is_completed ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                完了
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                進行中
              </>
            )}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600">作成日</h3>
          <p>{formatDate(task.created_at)}</p>
        </div>
      </div>
    </div>
  );
}