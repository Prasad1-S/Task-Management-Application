import { query } from "@/lib/db";

export default async function Home() {
  const result = await query("SELECT NOW()");
  
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        DB Connected Successfully 🎉
      </h1>
      <p className="mt-4">
        Server Time: {result.rows[0].now.toString()}
      </p>
    </div>
  );
}