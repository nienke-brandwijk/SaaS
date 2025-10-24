import { supabase } from '../lib/supabaseClient';

export default async function Home() {
  const { data, error, count } = await supabase.from('Test').select('*', { count: 'exact' });
  console.log('rows:', data);
  console.log('count:', count);
  if (error) {
    console.error(error);
  }
  type TestRows = typeof data;
  const rows: TestRows = data;
  return (
    <div>
      <p className="text-[10rem] underline text-center">Hello World!</p>
      <ul className="mt-10 space-y-2">
        {rows?.map((row) => (
          <li key={row.id} className="text-[2rem]">
            {row.name} {row.color}
          </li>
        ))}
      </ul>
    </div>
  );
}