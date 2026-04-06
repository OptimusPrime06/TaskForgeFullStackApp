import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Task, TaskStatus } from '../../api/tasks.api';
import { Role } from '@taskforge/shared';

interface TaskCardProps {
  task: Task;
  canDelete?: boolean;
  onDelete?: (taskId: string) => void;
  isDeleting?: boolean;
}

export const TaskCard = ({ task, canDelete = false, onDelete, isDeleting = false }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get color configurations based on status or arbitrary data to match UI specs
  const getBadgeSpecs = () => {
    switch (task.status) {
      case TaskStatus.BACKLOG:
        return { bg: 'bg-secondary_container', text: 'text-on_secondary_container', label: 'BACKLOG' };
      case TaskStatus.IN_PROGRESS:
        return { bg: 'bg-tertiary_container', text: 'text-on_tertiary_container', label: 'ONGOING' };
      case TaskStatus.DONE:
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'SHIPPED' };
      case TaskStatus.QA:
        return { bg: 'bg-surface_container', text: 'text-on_surface_variant', label: 'TESTING' };
      default:
        return { bg: 'bg-surface_container', text: 'text-on_surface_variant', label: task.status };
    }
  };

  const badge = getBadgeSpecs();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-surface_container_lowest p-4 rounded-xl group hover:shadow-xl hover:shadow-on_surface/5 transition-all duration-300 cursor-grab active:cursor-grabbing relative ${
        isDragging ? 'opacity-50 ring-2 ring-primary scale-105' : ''
      }`}
    >
      {/* Delete Button */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this task?')) {
              onDelete?.(task.id);
            }
          }}
          disabled={isDeleting}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-error text-white p-1.5 rounded hover:bg-error/90 disabled:opacity-50"
          title="Delete task"
        >
          <span className="material-symbols-outlined text-base">delete</span>
        </button>
      )}

      <div className="flex justify-between items-start mb-3">
        <span className={`${badge.bg} ${badge.text} px-2 py-0.5 rounded text-[10px] font-bold`}>
          {badge.label}
        </span>
        <span className="text-[10px] font-bold text-on_surface_variant tracking-tighter truncate max-w-[80px]">
          {task.id.split('-')[0]}
        </span>
      </div>
      
      <h4 className={`text-sm font-semibold text-on_surface leading-snug mb-4 group-hover:text-primary transition-colors ${task.status === TaskStatus.DONE ? 'line-through decoration-on_surface_variant/40' : ''}`}>
        {task.title}
      </h4>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary_container text-white flex items-center justify-center text-[10px] font-bold border border-surface">
             {task.assignee?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-[10px] font-medium text-on_surface_variant truncate max-w-[80px]">
             {task.assignee?.email || 'Unassigned'}
          </span>
        </div>
        
        {/* Priority Icon placeholder mapping */}
        <div className="flex items-center gap-1.5 text-tertiary">
          <span className="material-symbols-outlined text-[10px]">priority_high</span>
        </div>
      </div>
    </div>
  );
};
