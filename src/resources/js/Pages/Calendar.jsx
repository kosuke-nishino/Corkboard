import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ja from 'date-fns/locale/ja';
import "react-big-calendar/lib/css/react-big-calendar.css";
// カスタムCSSはインラインスタイルで対応
import { useState, useEffect } from 'react';
import TaskForm from "@/Components/TaskForm";
import EditTaskForm from "@/Components/EditTaskForm";
import TaskDetail from "@/Components/TaskDetail";
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

// ドラッグ＆ドロップ機能を追加したカレンダーコンポーネント
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

// カレンダーのカスタムスタイル
const calendarStyles = {
  event: {
    borderRadius: '4px',
    padding: '2px 5px',
    marginBottom: '1px',
    fontSize: '0.85em',
    lineHeight: '1.2',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  showMore: {
    backgroundColor: 'transparent',
    color: '#3182ce',
    fontWeight: 'bold',
    textDecoration: 'underline',
    padding: '2px 5px',
  },
  monthCell: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  dateHeader: {
    paddingRight: '5px',
    textAlign: 'right',
    fontSize: '0.85em',
    fontWeight: 'bold',
  },
  eventList: {
    flex: 1,
    overflowY: 'auto',
    padding: '2px 0',
  },
};

// カスタム月表示コンポーネント
const CustomMonthView = {
  // カスタムの日付セル
  dateCell: ({ date, children }) => {
    return (
      <div style={calendarStyles.monthCell}>
        {children}
      </div>
    );
  },
  // カスタムのイベントコンテナ
  eventContainerWrapper: ({ children, events, value }) => {
    // 最大4つまで表示
    const visibleEvents = events.slice(0, 4);

    return (
      <div style={calendarStyles.eventList}>
        {children(visibleEvents)}
      </div>
    );
  },
};

export default function Calendar() {
  const { props } = usePage();
  const [tasks, setTasks] = useState(props.tasks || []);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // タスクをカレンダーイベント形式に変換
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.start_date ? new Date(task.start_date) : new Date(),
    end: task.end_date ? new Date(task.end_date) : new Date(),
    allDay: true,
    resource: task,
    // タスクの色情報を追加
    color: task.color || '#fffacd',
  }));

  // 日付選択時のハンドラー
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setShowTaskForm(true);
  };

  // イベントクリック時のハンドラー
  const handleSelectEvent = (event, e) => {
    // クリックされたタスクを選択
    setSelectedTask(event.resource);

    // 詳細表示モーダルを表示
    setShowTaskDetail(true);

    // イベントの伝播を停止
    e.stopPropagation();
  };

  // 編集ボタンクリック時のハンドラー
  const handleEditClick = () => {
    setShowEditForm(true);
  };

  // 削除ボタンクリック時のハンドラー
  const handleDeleteClick = async () => {
    if (!selectedTask) return;

    if (confirm('このタスクを削除してもよろしいですか？')) {
      try {
        await axios.delete(`/task-memos/${selectedTask.id}`);
        // タスクリストから削除したタスクを除外
        setTasks(tasks.filter(task => task.id !== selectedTask.id));
        setShowActionMenu(false);
      } catch (error) {
        console.error('タスク削除エラー:', error);
        alert('タスクの削除に失敗しました');
      }
    }
  };

  // タスク更新完了時のハンドラー
  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
    setShowEditForm(false);
  };

  // タスクのドラッグ＆ドロップによる日付変更
  const handleEventDrop = async ({ event, start, end }) => {
    try {
      const task = event.resource;

      // 日付をYYYY-MM-DD形式に変換
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      // 新しい日付でタスクを更新
      const response = await axios.put(`/task-memos/${task.id}`, {
        ...task,
        start_date: formatDate(start),
        end_date: formatDate(end || start),
      });

      // タスクリストを更新
      setTasks(tasks.map(t =>
        t.id === task.id ? response.data : t
      ));

      console.log(`タスク "${task.title}" の日付を変更しました:`, formatDate(start));
    } catch (error) {
      console.error('タスクの日付変更に失敗しました:', error);
      alert('タスクの日付変更に失敗しました。');
    }
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
    <AuthenticatedLayout>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div style={{ height: '700px', position: 'relative' }} className="calendar-container">
                <DragAndDropCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable
                  draggableAccessor={() => true}
                  onEventDrop={handleEventDrop}
                  resizable
                  views={['month', 'week']}
                  messages={{
                    today: '今日',
                    previous: '前へ',
                    next: '次へ',
                    month: '月',
                    week: '週',
                    agenda: 'アジェンダ',
                    date: '日付',
                    time: '時間',
                    event: 'イベント',
                    allDay: '終日',
                    noEventsInRange: 'この期間にイベントはありません',
                    showMore: count => `さらに ${count} 件表示`,
                  }}
                  culture="ja"
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.color,
                      borderColor: event.color,
                      color: '#000',
                    },
                  })}
                  popup={true}
                  popupOffset={30}
                  components={{
                    month: {
                      dateHeader: ({ date, label }) => <span>{label}</span>,
                      dateCellWrapper: CustomMonthView.dateCell,
                      eventContainerWrapper: CustomMonthView.eventContainerWrapper,
                    },
                    event: (props) => {
                      const { event, title } = props;
                      return (
                        <div
                          style={{ ...calendarStyles.event }}
                          className="cursor-pointer hover:opacity-80"
                        >
                          {title}
                        </div>
                      );
                    },
                    showMore: () => null,
                  }}
                  dayMaxEvents={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タスク作成モーダル */}
      <Modal show={showTaskForm} onClose={() => setShowTaskForm(false)}>
        <TaskForm
          onTaskCreated={handleTaskCreated}
          initialDate={selectedDate}
          onClose={() => setShowTaskForm(false)}
        />
      </Modal>

      {/* タスク詳細モーダル */}
      <Modal show={showTaskDetail} onClose={() => setShowTaskDetail(false)}>
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            onEdit={() => {
              setShowTaskDetail(false);
              setShowEditForm(true);
            }}
            onDelete={handleDeleteClick}
          />
        )}
      </Modal>

      {/* タスク編集モーダル */}
      <Modal show={showEditForm} onClose={() => setShowEditForm(false)}>
        {selectedTask && (
          <EditTaskForm
            task={selectedTask}
            onSuccess={handleTaskUpdated}
            onClose={() => setShowEditForm(false)}
          />
        )}
      </Modal>
    </AuthenticatedLayout>
  );
}