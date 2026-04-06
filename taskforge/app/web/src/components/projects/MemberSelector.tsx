import { useState, useRef, useEffect } from 'react';
import type { User } from '../../api/users.api';
import { Role } from '@taskforge/shared';

interface MemberSelectorProps {
  availableUsers: User[];
  selectedMembers: User[];
  onMembersChange: (members: User[]) => void;
  isLoading?: boolean;
}

export const MemberSelector = ({
  availableUsers,
  selectedMembers,
  onMembersChange,
  isLoading = false,
}: MemberSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = availableUsers.filter(
    (user) =>
      !selectedMembers.find((m) => m.id === user.id) &&
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleMember = (user: User) => {
    const isSelected = selectedMembers.find((m) => m.id === user.id);
    if (isSelected) {
      onMembersChange(selectedMembers.filter((m) => m.id !== user.id));
    } else {
      onMembersChange([...selectedMembers, user]);
    }
  };

  const getRoleColor = (role: Role) => {
    const roleColors: Record<Role, string> = {
      [Role.ADMIN]: 'bg-error text-white',
      [Role.PROJECT_MANAGER]: 'bg-primary text-white',
      [Role.MEMBER]: 'bg-surface_variant text-on_surface',
      [Role.QA]: 'bg-tertiary text-white',
    };
    return roleColors[role] || 'bg-outline text-on_surface';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full bg-surface_container_lowest border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-3 px-4 transition-all text-on_surface text-left font-medium flex justify-between items-center"
      >
        <span className="text-on_surface_variant">
          {selectedMembers.length > 0
            ? `${selectedMembers.length} member(s) selected`
            : 'Select members (optional)...'}
        </span>
        <span
          className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>

      {/* Selected Members Tags */}
      {selectedMembers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-primary_container text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <span>{member.email}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${getRoleColor(member.role)}`}>
                {member.role}
              </span>
              <button
                onClick={() => handleToggleMember(member)}
                className="ml-1 hover:text-error_container transition-colors"
                title="Remove member"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface_container_lowest border border-outline_variant rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-surface_container_low p-3 border-b border-outline_variant">
            <input
              type="text"
              placeholder="Search by email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface_container_lowest border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-2 px-3 transition-all text-on_surface text-sm"
              autoFocus
            />
          </div>

          {filteredUsers.length > 0 ? (
            <ul className="divide-y divide-outline_variant/20 py-1">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => handleToggleMember(user)}
                    className="w-full text-left px-4 py-3 hover:bg-surface_container_low transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-on_surface font-medium text-sm">{user.email}</p>
                      <p className="text-on_surface_variant text-xs">{user.role}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-on_surface_variant text-sm">
              {availableUsers.length === 0 ? 'No users available' : 'No matching users'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
