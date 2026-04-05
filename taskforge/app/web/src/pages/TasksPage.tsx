import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  DndContext, 
  type DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor,
  closestCorners
} from '@dnd-kit/core';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../api/tasks.api';
import { KanbanColumn } from '../components/tasks/KanbanColumn';

export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  // We mock a project title for now since we don't have a single project fetch endpoint defined
  const projectTitle = "Editorial Platform Redesign"; 
  
  const { tasks, isLoading, createTask, updateTaskStatus } = useTasks(projectId);
  const [isCreatingForStatus, setIsCreatingForStatus] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag begins
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Dropped outside a valid droppable area
    if (!over) return;

    const taskId = active.id as string;
    // Over.id can be either a Column ID (if dropped on empty space) or another Task ID (if dropped on a task)
    // We check if it is explicitly a Column ID, otherwise we retrieve the parent column from data
    const newStatus = (typeof over.id === 'string' && Object.values(TaskStatus).includes(over.id as TaskStatus)) 
      ? over.id as TaskStatus
      : over.data.current?.sortable?.containerId as TaskStatus;

    if (newStatus) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle || !isCreatingForStatus) return;
    
    // Currently, our createTask hook doesn't accept a status, it defaults to TODO on backend. 
    // We create it, then if they hit "+" on a different column, we immediately patch it.
    const success = await createTask(newTaskTitle);
    if (success) {
      setNewTaskTitle('');
      setIsCreatingForStatus(null);
    }
  };

  const columns = [
    { id: TaskStatus.BACKLOG, title: 'Backlog', dotColor: 'bg-outline_variant' },
    { id: TaskStatus.TODO, title: 'To Do', dotColor: 'bg-primary' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress', dotColor: 'bg-tertiary_container' },
    { id: TaskStatus.IN_REVIEW, title: 'In Review', dotColor: 'bg-secondary' },
    { id: TaskStatus.QA, title: 'QA', dotColor: 'bg-on_tertiary_container' },
    { id: TaskStatus.DONE, title: 'Done', dotColor: 'bg-emerald-500' },
  ];

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <span className="text-on_surface_variant font-bold text-lg animate-pulse">Loading Board...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Dashboard Header */}
      <div className="px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-on_surface_variant uppercase tracking-widest mb-2">
            <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary truncate max-w-[200px]">{projectTitle}</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary truncate max-w-[100px]">{projectId?.split('-')[0]}</span>
          </nav>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on_surface">Production Board</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface_container_high text-on_surface px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-surface_container_highest transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filter
          </button>
          <button className="bg-surface_container_high text-on_surface px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-surface_container_highest transition-colors">
            <span className="material-symbols-outlined text-lg">share</span>
            Share
          </button>
        </div>
      </div>

      {isCreatingForStatus && (
        <div className="mx-8 mb-4 bg-surface_container_low p-4 rounded-xl flex items-center gap-4 border border-outline_variant/30 shrink-0">
           <span className="text-xs font-bold text-on_surface_variant">New task in <span className="text-primary">{isCreatingForStatus}</span></span>
           <input 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
            className="flex-1 bg-surface_container_lowest border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-2 px-4 text-sm transition-all text-on_surface placeholder:text-on_surface_variant/60" 
            placeholder="What needs to be done?"
            autoFocus
          />
          <button onClick={handleCreateTask} className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary_container">Save</button>
          <button onClick={() => setIsCreatingForStatus(null)} className="px-4 py-2 bg-transparent text-primary font-bold rounded-lg text-sm hover:bg-surface_container_highest">Cancel</button>
        </div>
      )}

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto px-8 pb-8 flex gap-6 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          {columns.map(col => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              dotColor={col.dotColor}
              tasks={tasks.filter(t => t.status === col.id)}
              onAddTask={() => setIsCreatingForStatus(col.id)}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
