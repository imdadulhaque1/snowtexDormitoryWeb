import React, { useState, useEffect, useCallback, useMemo } from "react";

interface User {
  userId: number;
  name: string;
  email: string;
}

interface UserSelectorProps {
  users: User[];
  roleBasedUser: User[]; // Role-based users
  onSelectionChange: (selectedUsers: number[]) => void;
  label: string;
}

const UserMultiSelector: React.FC<UserSelectorProps> = React.memo(
  ({ users, roleBasedUser, onSelectionChange, label }) => {
    const roleBasedUserIds = useMemo(
      () => roleBasedUser.map((user) => user.userId),
      [roleBasedUser]
    );
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [hoveredUser, setHoveredUser] = useState<number | null>(null);

    useEffect(() => {
      // Preselect role-based users on component load
      const preSelected = users
        .filter((user) => roleBasedUserIds.includes(user.userId))
        .map((user) => user.userId);
      setSelectedUsers(preSelected);
      onSelectionChange(preSelected);
    }, [users, roleBasedUserIds, onSelectionChange]);

    const handleCheckboxChange = useCallback(
      (userId: number) => {
        // Toggle the selection state of a user
        const updatedSelection = selectedUsers.includes(userId)
          ? selectedUsers.filter((id) => id !== userId)
          : [...selectedUsers, userId];

        setSelectedUsers(updatedSelection);
        onSelectionChange(updatedSelection);
      },
      [selectedUsers, onSelectionChange]
    );

    const handleSelectAll = useCallback(
      (isSelectAll: boolean) => {
        if (isSelectAll) {
          // Select all users
          const allUserIds = users.map((user) => user.userId);
          setSelectedUsers(allUserIds);
          onSelectionChange(allUserIds);
        } else {
          // Deselect all users
          setSelectedUsers([]);
          onSelectionChange([]);
        }
      },
      [users, onSelectionChange]
    );

    return (
      <div className="flex flex-col w-full h-full bg-primary96 p-5 rounded-lg border-2 border-primary80">
        <div className="flex flex-col">
          <p className="font-workSans text-black text-md mb-3 pb-1">{label}</p>

          <label className="flex items-center space-x-2 mb-3 border-b-2 border-primary80 border-dashed pb-2">
            <input
              type="checkbox"
              checked={
                selectedUsers.length === users.length &&
                users.every((user) => selectedUsers.includes(user.userId))
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="font-workSans text-black text-sm">Select All</span>
          </label>
        </div>

        {users.map((user) => (
          <label
            key={user.userId}
            className="flex items-center space-x-2 mb-2 relative group cursor-pointer"
            onMouseEnter={() => setHoveredUser(user.userId)}
            onMouseLeave={() => setHoveredUser(null)}
          >
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.userId)}
              onChange={() => handleCheckboxChange(user.userId)}
              className="w-4 h-4 cursor-pointer"
            />
            <span
              className={`font-workSans text-sm ${
                hoveredUser === user.userId ? "text-blue-600" : "text-black"
              }`}
            >
              {hoveredUser === user.userId ? `${user.name}` : user.email}
            </span>
          </label>
        ))}
      </div>
    );
  }
);

export default UserMultiSelector;
