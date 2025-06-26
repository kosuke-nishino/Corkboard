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
import { useState, useEffect, useRef } from 'react';
import TaskForm from "@/Components/TaskForm";
import EditTaskForm from "@/Components/EditTaskForm";
import TaskDetail from "@/Components/TaskDetail";
import StickyNoteForm from "@/Components/StickyNoteForm";
import ImageForm from '@/Components/ImageForm';
import EditStickyNoteForm from "@/Components/EditStickyNoteForm";
import MoveableStickyNote from "@/Components/MoveableStickyNote";
import MoveableImage from "@/Components/MoveableImage";
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
  const [stickyNotes, setStickyNotes] = useState([]);
  const [images, setImages] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showStickyNoteForm, setShowStickyNoteForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingStickyNote, setEditingStickyNote] = useState(null);
  const formContainerRef = useRef(null);

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
    } catch (error) {
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
    } catch (error) {
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

  // 付箋作成完了時のハンドラー
  const handleStickyNoteCreated = async (stickyNote) => {
    const formRect = formContainerRef.current?.getBoundingClientRect();
    const offsetX = Math.max(100, (formRect?.left || 100) - 50);
    const offsetY = Math.max(100, (formRect?.top || 100) - 50);

    try {
      const response = await axios.put(`/sticky-notes/${stickyNote.id}/position`, {
        x: offsetX,
        y: offsetY,
        width: 150,
        height: 100,
        rotation: 0,
        z_index: 15,
      });

      const newStickyNote = {
        ...stickyNote,
        x: offsetX,
        y: offsetY,
        width: 150,
        height: 100,
        rotation: 0,
        z_index: 15,
      };

      setStickyNotes([...stickyNotes, newStickyNote]);
    } catch (error) {
      const newStickyNote = {
        ...stickyNote,
        x: offsetX,
        y: offsetY,
        width: 150,
        height: 100,
        rotation: 0,
        z_index: 15,
      };
      setStickyNotes([...stickyNotes, newStickyNote]);
    }

    setShowStickyNoteForm(false);
  };

  // 付箋更新完了時のハンドラー
  const handleStickyNoteUpdated = (updatedStickyNote) => {
    setStickyNotes((prevStickyNotes) =>
      prevStickyNotes.map((sn) => (sn.id === updatedStickyNote.id ? updatedStickyNote : sn))
    );
    setEditingStickyNote(null);
  };

  // 付箋削除時のハンドラー
  const handleStickyNoteDeleted = async (stickyNote) => {
    try {
      await axios.delete(`/sticky-notes/${stickyNote.id}`);
      setStickyNotes((prev) => prev.filter((sn) => sn.id !== stickyNote.id));
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  // 画像作成完了時のハンドラー
  const handleImageCreated = async (image) => {
    const formRect = formContainerRef.current?.getBoundingClientRect();
    const offsetX = Math.max(300, (formRect?.left || 300) - 100);
    const offsetY = Math.max(300, (formRect?.top || 300) - 100);

    try {
      const response = await axios.put(`/test/images/${image.id}/position`, {
        x: offsetX,
        y: offsetY,
        width: image.width || 200,
        height: image.height || 150,
        rotation: 0,
        z_index: image.z_index || 5,
      });

      const newImage = {
        ...image,
        x: offsetX,
        y: offsetY,
        width: image.width || 200,
        height: image.height || 150,
        rotation: 0,
        z_index: image.z_index || 5,
      };

      setImages([...images, newImage]);
    } catch (error) {
      const newImage = {
        ...image,
        x: offsetX,
        y: offsetY,
        width: image.width || 200,
        height: image.height || 150,
        rotation: 0,
        z_index: image.z_index || 5,
      };
      setImages([...images, newImage]);
    }

    setShowImageForm(false);
  };

  // 画像削除時のハンドラー
  const handleImageDeleted = async (image) => {
    try {
      await axios.delete(`/test/images/${image.id}`);
      setImages((prev) => prev.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error('画像削除エラー:', error);
      alert('画像削除に失敗しました');
    }
  };

  // データ取得
  useEffect(() => {
    const fetchStickyNotesAndImages = async () => {
      try {
        const stickyNotesResponse = await axios.get('/sticky-notes?location=calendar');
        setStickyNotes(stickyNotesResponse.data || []);

        const imagesResponse = await axios.get('/test/images?location=calendar');
        setImages(imagesResponse.data || []);
      } catch (error) {
        console.error('データ取得エラー:', error);
      }
    };
    fetchStickyNotesAndImages();
  }, []);

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

      {/* 作成ボタン群 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-black py-2 px-4 rounded-full shadow"
          onClick={() => setShowTaskForm(true)}
        >
          タスク作成
        </button>
        <button 
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full shadow"
          onClick={() => setShowStickyNoteForm(true)}
        >
          付箋作成
        </button>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow"
          onClick={() => setShowImageForm(true)}>
          画像作成
        </button>
      </div>

      {/* タスク作成モーダル */}
      <Modal show={showTaskForm} onClose={() => setShowTaskForm(false)} maxWidth="md">
        <TaskForm
          onTaskCreated={handleTaskCreated}
          initialDate={selectedDate}
          onClose={() => setShowTaskForm(false)}
        />
      </Modal>

      {/* 付箋作成フォーム */}
      {showStickyNoteForm && (
        <div
          ref={formContainerRef}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <StickyNoteForm
            onSuccess={handleStickyNoteCreated}
            onClose={() => setShowStickyNoteForm(false)}
            initialLocation="calendar"
          />
        </div>
      )}

      {/* 画像作成フォーム */}
      {showImageForm && (
        <div
          ref={formContainerRef}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <ImageForm
            onSuccess={handleImageCreated}
            onClose={() => setShowImageForm(false)}
            initialLocation="calendar"
          />
        </div>
      )}

      {/* タスク詳細モーダル */}
      <Modal show={showTaskDetail} onClose={() => setShowTaskDetail(false)}>
          <TaskDetail
            task={selectedTask}
            onEdit={() => {
              setShowTaskDetail(false);
              setShowEditForm(true);
            }}
            onDelete={handleDeleteClick}
          />
      </Modal>

      {/* タスク編集モーダル */}
      <Modal show={showEditForm} onClose={() => setShowEditForm(false)} maxWidth="md">
        {selectedTask && (
          <EditTaskForm
            task={selectedTask}
            onSuccess={handleTaskUpdated}
            onClose={() => setShowEditForm(false)}
          />
        )}
      </Modal>

      {/* 付箋編集モーダル */}
      <Modal show={!!editingStickyNote} onClose={() => setEditingStickyNote(null)}>
        {editingStickyNote && (
          <EditStickyNoteForm
            stickyNote={editingStickyNote}
            onSuccess={handleStickyNoteUpdated}
            onClose={() => setEditingStickyNote(null)}
          />
        )}
      </Modal>

      {/* 付箋と画像表示エリア */}
      <div className="mt-24 relative z-0">
        {stickyNotes.map((stickyNote) => (
          <MoveableStickyNote
            key={`sticky-${stickyNote.id}`}
            stickyNote={stickyNote}
            onEdit={(sn) => setEditingStickyNote(sn)}
            onDelete={handleStickyNoteDeleted}
          />
        ))}

        {images.map((image) => (
          <MoveableImage
            key={`image-${image.id}`}
            image={image}
            onDelete={handleImageDeleted}
          />
        ))}
      </div>
    </AuthenticatedLayout>
  );
}