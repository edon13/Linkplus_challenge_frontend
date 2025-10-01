"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

export default function UserDetailsPage() {
  const params = useParams();
  const { items } = useSelector((s) => s.users);
  const user = items.find(u => u.id === parseInt(params.id));
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <Link href="/home" className="text-blue-600 hover:underline">← Back to list</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
      <Link href="/home" className="text-sm text-blue-600 hover:underline">← Back to list</Link>
        <h1 className="text-2xl font-semibold">User Details</h1>
        <div/>
        
      </div>

      <div className="grid gap-2">
        <div><span className="font-medium">ID:</span> {user.id}</div>
        <div><span className="font-medium">Name:</span> {user.name}</div>
        {user.username && <div><span className="font-medium">Username:</span> {user.username}</div>}
        <div><span className="font-medium">Email:</span> {user.email}</div>
        {user.phone && <div><span className="font-medium">Phone:</span> {user.phone}</div>}
        {user.website && <div><span className="font-medium">Website:</span> {user.website}</div>}
        {user.createdAt && <div><span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</div>}
      </div>

      {user.address && (user.address.street || user.address.city) && (
        <div className="grid gap-1">
          <h2 className="text-lg font-medium">Address</h2>
          {(user.address.suite || user.address.street) && (
            <div>{user.address.suite && user.address.street ? `${user.address.suite}, ${user.address.street}` : user.address.suite || user.address.street}</div>
          )}
          {(user.address.city || user.address.zipcode) && (
            <div>{user.address.city} {user.address.zipcode}</div>
          )}
          {(user.address.geo?.lat || user.address.geo?.lng) && (
            <div>Geo: {user.address.geo.lat}, {user.address.geo.lng}</div>
          )}
        </div>
      )}

      {user.company && user.company.name && (
        <div className="grid gap-1">
          <h2 className="text-lg font-medium">Company</h2>
          <div><span className="font-medium">Name:</span> {user.company.name}</div>
          {user.company.catchPhrase && <div><span className="font-medium">Catch phrase:</span> {user.company.catchPhrase}</div>}
          {user.company.bs && <div><span className="font-medium">BS:</span> {user.company.bs}</div>}
        </div>
      )}
    </div>
  );
}


