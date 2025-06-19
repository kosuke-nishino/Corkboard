import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ja from 'date-fns/locale/ja';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from 'react';
import TaskForm from "@/Components/TaskForm";
import Modal from "@/Components/Modal";
import axios from 'axios';

// date-fnsのローカライザーを設定
const locales = {
  'ja': ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar() {
  const { props } = usePage();
  const [tasks, setTasks] = useState(props.tasks || []);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // タスクをカレンダーイベント形式に変換
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.start_date ? new Date(task.start_date) : new Date(),
    end: task.end_date ? new Date(task.end_date) : new Date(),
    allDay: true,
    resource: task,
  }));

  // 日付選択時のハンドラー
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setShowTaskForm(true);
  };

  // イベントクリック時のハンドラー
  const handleSelectEvent = (event) => {
    // タスクの詳細表示や編集機能を実装する場合はここに追加
    console.log('イベント選択:', event);
  };

  // タスク作成完了時のハンドラー
  const handleTaskCreated = async (task) => {
    // 新規タスクの初期位置をDBに保存
    try {
      const response = await axios.put(`/task-memos/${task.id}/position`, {
        x: 200, // 固定値でテスト
        y: 200, // 固定値でテスト
        width: 200,
        height: 180,
        rotation: 0,
        z_index: 10,
      });
      
      // 位置情報を含むタスクオブジェクトを作成
      const newTask = {
        ...task,
        x: 200,
        y: 200,
        width: 200,
        height: 180,
        rotation: 0,
        z_index: 10,
      };
      
      setTasks([...tasks, newTask]);
      console.log("新規タスク作成完了:", newTask);
    } catch (error) {
      console.error('初期位置保存エラー:', error);
      // エラーでも表示はする（位置は後で調整可能）
      const newTask = {
        ...task,
        x: 200,
        y: 200,
        width: 200,
        height: 180,
        rotation: 0,
        z_index: 10,
      };
      setTasks([...tasks, newTask]);
    }

    setShowTaskForm(false);
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">カレンダー</h2>}
    >
      <Head title="カレンダー" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">タスクカレンダー</h3>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  タスク作成
                </button>
              </div>
              
              <div style={{ height: '600px' }}>
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable
                  views={['month', 'week', 'day']}
                  messages={{
                    today: '今日',
                    previous: '前へ',
                    next: '次へ',
                    month: '月',
                    week: '週',
                    day: '日',
                    agenda: 'アジェンダ',
                    date: '日付',
                    time: '時間',
                    event: 'イベント',
                    allDay: '終日',
                    noEventsInRange: 'この期間にイベントはありません',
                  }}
                  culture="ja"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タスク作成モーダル */}
      <Modal show={showTaskForm} onClose={() => setShowTaskForm(false)}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            新しいタスクを作成
          </h2>
          <TaskForm 
            onTaskCreated={handleTaskCreated} 
            initialDate={selectedDate}
          />
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}