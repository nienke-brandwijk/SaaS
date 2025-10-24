import { User } from '../src/domain/user';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_URL}/api/users`, {
    cache: 'no-store',
  });
  const users = await res.json();
  return (
    <div>
      <p className="text-[10rem] underline text-center">Hello World!</p>
      <ul className="mt-10 space-y-2">
        {users?.map((user: User) => (
          <li key={user.id} className="text-[2rem]">
            {user.username} {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}