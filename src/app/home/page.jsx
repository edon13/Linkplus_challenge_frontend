"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUsers } from "@/features/users/usersSlice";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
} from "@/components/ui/table";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.users);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [status, dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) =>
      (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  if (status === "loading") return <div className="p-6">Loading…</div>;
  if (status === "failed") return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full max-w-md rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Table>
        <TableCaption>Users</TableCaption>
        <TableHeader>
          <TableRow>
       
            <TableHead>Name</TableHead>
        
            <TableHead>Email</TableHead>
         
            <TableHead>Company</TableHead>
         
       
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((u) => (
            <TableRow key={u.id}>
             
              <TableCell onClick={() => router.push(`/details/${u.id}`)}>{u.name}</TableCell>
       
              <TableCell>{u.email}</TableCell>
           <TableCell>{u.company?.name}</TableCell>
      
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}