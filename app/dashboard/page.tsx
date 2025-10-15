"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Food = {
  id: string;
  created_at: string;
  date: string;
  image_url: string;
  meal_name: string;
  meal_type: string;
  userId: string;
  update_at: string;
};

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [meals, setMeals] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMeals = async () => {
      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError || !user) {
        setMeals([]);
        setLoading(false);
        return;
      }
      setUserId(user.id);
      setProfileUrl(user.user_metadata?.avatar_url || null);
      const { data, error } = await client
        .from("food_tb")
        .select("*")
        .eq("userId", user.id)
        .order("date", { ascending: false });
      if (error) {
        setMeals([]);
      } else {
        setMeals(data ?? []);
      }
      setLoading(false);
    };
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter(
    (meal) =>
      meal.meal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.meal_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.date.includes(searchQuery)
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    const { error } = await client.from("food_tb").delete().eq("id", id);
    if (error) {
      alert("Failed to delete meal.");
    } else {
      setMeals((prev) => prev.filter((meal) => meal.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/updatefood/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-4">
      <div className="relative w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        {profileUrl && userId && (
          <Image
            src={profileUrl}
            alt="Profile"
            width={48}
            height={48}
            className="absolute top-4 left-4 rounded-full cursor-pointer border-2 border-green-600 hover:border-green-800"
            onClick={() => router.push(`/profile/${userId}`)}
            unoptimized
          />
        )}
        <div className="text-center mb-4 mt-1">
          <Link href="/" className="text-sm text-green-600 hover:underline">
            ← Return to home page
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-900 mb-6">
          Your Meal Dashboard
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, meal type, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300"
          />
          <a
            href="/addfood"
            className="w-full md:w-1/3 py-3 px-8 text-lg font-semibold rounded-xl text-white text-center bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            Add New Meal
          </a>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md border-2 border-green-200">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Picture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Meal Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-green-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {!loading && filteredMeals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No meals found.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredMeals.map((meal) => (
                  <tr
                    key={meal.id}
                    className="hover:bg-green-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {meal.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image
                        src={meal.image_url}
                        alt={meal.meal_name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {meal.meal_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {meal.meal_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(meal.id)}
                        className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-md mr-2"
                        aria-label="Edit"
                      >
                        <span role="img" aria-label="pencil icon">
                          ✏️
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md"
                        aria-label="Delete"
                      >
                        <span role="img" aria-label="trash can icon">
                          🚮
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
