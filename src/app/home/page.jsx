"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUsers, addUser, updateUser, deleteUser, setSortField, setSortDirection } from "@/features/users/usersSlice";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
} from "@/components/ui/table";
import UserForm from "@/components/UserForm";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, status, error, sortField, sortDirection } = useSelector((s) => s.users);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [status, dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filteredItems = items;
    
    if (q) {
      filteredItems = items.filter((u) =>
        (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
      );
    }
    
    if (sortField) {
      filteredItems = [...filteredItems].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'company') {
          aVal = a.company?.name || '';
          bVal = b.company?.name || '';
        }
        
        if (sortField === 'createdAt') {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filteredItems;
  }, [items, query, sortField, sortDirection]);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      dispatch(updateUser({ id: editingUser.id, ...userData }));
    } else {
      dispatch(addUser(userData));
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };



  if (status === "loading") return <div className="p-6">Loading…</div>;
  if (status === "failed") return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full max-w-md rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <select
            value={`${sortField || 'createdAt'}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              dispatch(setSortField(field));
              dispatch(setSortDirection(direction));
            }}
            className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
            <option value="company-asc">Company A-Z</option>
            <option value="company-desc">Company Z-A</option>
          </select>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add User
          </button>
        </div>
      </div>
      <Table>
        <TableCaption>Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((u) => (
            <TableRow key={u.id}>
              <TableCell 
                className="cursor-pointer hover:text-blue-600"
                onClick={() => router.push(`/details/${u.id}`)}
              >
                {u.name}
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.company?.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(u);
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(u.id);
                    }}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <UserForm
        user={editingUser}
        onSave={handleSaveUser}
        onCancel={handleCancelForm}
        isOpen={showForm}
      />
    </div>
  );
}