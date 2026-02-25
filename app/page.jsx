import { query } from "@/lib/db";

export default async function Home() {
  
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        DB Connected Successfully 🎉
      </h1>
    </div>
  );
}