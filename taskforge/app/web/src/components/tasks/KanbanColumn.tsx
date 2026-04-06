import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type Task, TaskStatus } from '../../api/tasks.api';
import { TaskCard } from './TaskCard';
import { Role } from '@taskforge/shared';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  dotColor: string;
  onAddTask: () => void;
  userRole?: string;
  onDeleteTask?: (taskId: string) => void;
  isDeleting?: boolean;
}

export const KanbanColumn = ({ 
  id, 
  title, 
  tasks, 
  dotColor, 
  onAddTask,
  userRole,
  onDeleteTask,
  isDeleting = false 
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  const canDeleteTasks = userRole === Role.ADMIN || userRole === Role.PROJECT_MANAGER;

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex items-center justify-between mb-4 px-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
          <h3 className="text-sm font-bold text-on_surface_variant uppercase tracking-widest">{title}</h3>
          <span className="bg-surface_container_high px-1.5 py-0.5 rounded text-[10px] font-bold text-on_surface_variant">
            {tasks.length}
          </span>
        </div>
        <button className="text-on_surface_variant hover:text-on_surface">
          <span className="material-symbols-outlined text-lg">more_horiz</span>
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-4 overflow-y-auto overflow-x-hidden p-1 custom-scrollbar rounded-xl transition-colors duration-200 ${
          isOver ? 'bg-surface_container_low border-2 border-dashed border-primary/30' : ''
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              canDelete={canDeleteTasks}
              onDelete={onDeleteTask}
              isDeleting={isDeleting}
            />
          ))}
        </SortableContext>
        
        {/* Empty state padding for easy dropping */}
        {tasks.length === 0 && (
          <div className="h-full w-full min-h-[100px] border-2 border-transparent" />
        )}
      </div>

      <button 
        onClick={onAddTask}
        className="mt-4 shrink-0 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-outline_variant/30 text-on_surface_variant text-xs font-bold hover:bg-surface_container_low hover:border-primary/30 hover:text-primary transition-all"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Add Task
      </button>
    </div>
  );
};
