"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const mockMeals = [
    {
      id: 1,
      date: "2023-10-26",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Breakfast",
      name: "Scrambled Eggs with Toast",
      mealType: "Breakfast",
    },
    {
      id: 2,
      date: "2023-10-26",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Lunch",
      name: "Grilled Chicken Salad",
      mealType: "Lunch",
    },
    {
      id: 3,
      date: "2023-10-26",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Snack",
      name: "Apple Slices with Peanut Butter",
      mealType: "Snack",
    },
    {
      id: 4,
      date: "2023-10-25",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Dinner",
      name: "Spaghetti with Meatballs",
      mealType: "Dinner",
    },
    {
      id: 5,
      date: "2023-10-25",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Breakfast",
      name: "Oatmeal with Berries",
      mealType: "Breakfast",
    },
    {
      id: 6,
      date: "2023-10-25",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Lunch",
      name: "Chicken and Rice Bowl",
      mealType: "Lunch",
    },
    {
      id: 7,
      date: "2023-10-24",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Snack",
      name: "Protein Shake",
      mealType: "Snack",
    },
    {
      id: 8,
      date: "2023-10-24",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Dinner",
      name: "Baked Salmon with Asparagus",
      mealType: "Dinner",
    },
    {
      id: 9,
      date: "2023-10-24",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Breakfast",
      name: "Fruit Smoothie",
      mealType: "Breakfast",
    },
    {
      id: 10,
      date: "2023-10-23",
      imageUrl: "https://placehold.co/100x100/A5D6A7/000000?text=Lunch",
      name: "Tuna Sandwich",
      mealType: "Lunch",
    },
  ];

  // Filter meals based on search query
  const filteredMeals = mockMeals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.mealType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.date.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-4">
      {/* Link to return to home page */}

      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-4 mt-1">
          <Link href="/" className="text-sm text-green-600 hover:underline">
            ← Return to home page
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-900 mb-6">
          Your Meal Dashboard
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by name, meal type, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300"
          />
          {/* Add Food Button */}
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                >
                  Picture
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                >
                  Meal Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-green-800 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {filteredMeals.length > 0 ? (
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
                        src={meal.imageUrl}
                        alt={meal.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {meal.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {meal.mealType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          console.log("Edit clicked for meal ID:", meal.id)
                        }
                        className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-md mr-2"
                        aria-label="Edit"
                      >
                        <span role="img" aria-label="pencil icon">
                          ✏️
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          console.log("Delete clicked for meal ID:", meal.id)
                        }
                        className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md"
                        aria-label="Delete"
                      >
                        <span role="img" aria-label="trash can icon">
                          🚮
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No meals found.
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
