import Link from "next/link";
import { notFound } from "next/navigation";

async function getUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function UserDetailsPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

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
        <div><span className="font-medium">Username:</span> {user.username}</div>
        <div><span className="font-medium">Email:</span> {user.email}</div>
        <div><span className="font-medium">Phone:</span> {user.phone}</div>
        <div><span className="font-medium">Website:</span> {user.website}</div>
      </div>

      <div className="grid gap-1">
        <h2 className="text-lg font-medium">Address</h2>
        <div>{user.address?.suite}, {user.address?.street}</div>
        <div>{user.address?.city} {user.address?.zipcode}</div>
        <div>Geo: {user.address?.geo?.lat}, {user.address?.geo?.lng}</div>
      </div>

      <div className="grid gap-1">
        <h2 className="text-lg font-medium">Company</h2>
        <div><span className="font-medium">Name:</span> {user.company?.name}</div>
        <div><span className="font-medium">Catch phrase:</span> {user.company?.catchPhrase}</div>
        <div><span className="font-medium">BS:</span> {user.company?.bs}</div>
      </div>
    </div>
  );
}


