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
import { useAuthStore } from '../stores/auth.store';
import { TaskStatus } from '../api/tasks.api';
import { Role } from '@taskforge/shared';
import { KanbanColumn } from '../components/tasks/KanbanColumn';

export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthStore();
  // We mock a project title for now since we don't have a single project fetch endpoint defined
  const projectTitle = "Editorial Platform Redesign"; 
  
  const { tasks, isLoading, createTask, updateTaskStatus, deleteTask, assignTask } = useTasks(projectId);
  const [isCreatingForStatus, setIsCreatingForStatus] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');

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
    
    const success = await createTask(newTaskTitle, newTaskDescription);
    if (success && assigneeId) {
      // Get the newly created task (should be the last one added)
      const newTask = tasks[tasks.length - 1];
      if (newTask) {
        await assignTask(newTask.id, assigneeId);
      }
    }
    if (success) {
      setNewTaskTitle('');
      setNewTaskDescription('');
      setAssigneeId('');
      setIsCreatingForStatus(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
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
        <div className="absolute inset-0 z-50 bg-on_surface/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface_container_lowest w-full max-w-lg p-6 rounded-3xl shadow-2xl border border-outline_variant/30 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-on_surface mb-2">Create Task in <span className="text-primary">{isCreatingForStatus}</span></h3>
            
            <div className="space-y-4">
              <input 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                className="w-full bg-surface_container_low border-none focus:ring-2 focus:ring-primary/40 rounded-xl py-3 px-4 text-on_surface placeholder:text-on_surface_variant/60 font-semibold" 
                placeholder="Give your task a snappy title..."
                autoFocus
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full bg-surface_container_low border-none focus:ring-2 focus:ring-primary/40 rounded-xl py-3 px-4 text-sm text-on_surface placeholder:text-on_surface_variant/60 min-h-[100px] resize-none"
                placeholder="Add a detailed description..."
              />
              {(user?.role === Role.ADMIN || user?.role === Role.PROJECT_MANAGER) && (
                <div>
                  <label className="block text-sm font-semibold text-on_surface mb-2">Assign to (optional)</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full bg-surface_container_low border-none focus:ring-2 focus:ring-primary/40 rounded-xl py-3 px-4 text-on_surface"
                  >
                    <option value="">Unassigned</option>
                    {/* TODO: Replace with actual project members fetched from backend */}
                    <option value="demo-user-1">Demo User 1</option>
                    <option value="demo-user-2">Demo User 2</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button disabled={isLoading} onClick={() => {
                setIsCreatingForStatus(null);
                setAssigneeId('');
              }} className="px-5 py-2.5 bg-surface_container_high text-on_surface font-bold rounded-xl text-sm hover:bg-surface_container_highest transition-colors">Cancel</button>
              <button disabled={isLoading} onClick={handleCreateTask} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary_container transition-colors disabled:opacity-50">Create Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[450px]">
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                dotColor={col.dotColor}
                tasks={tasks.filter(t => t.status === col.id)}
                onAddTask={() => setIsCreatingForStatus(col.id)}
                userRole={user?.role}
                onDeleteTask={handleDeleteTask}
                isDeleting={isLoading}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
