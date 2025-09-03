"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddFoodPage() {
  const [formData, setFormData] = useState<{
    date: string;
    mealName: string;
    mealType: string;
    image: File | null;
  }>({
    date: "",
    mealName: "",
    mealType: "",
    image: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        [name]: files && files[0] ? files[0] : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    setSubmitted(true);
    // In a real app, you would send this data to a backend or database
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        {/* Link to return to dashboard */}
        <div className="text-center mb-4">
          <Link
            href="/dashboard"
            className="text-sm text-green-600 hover:underline"
          >
            ← Return to dashboard
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-900 mb-6">
          New Entry
        </h1>

        {submitted && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4 text-center"
            role="alert"
          >
            <span className="block sm:inline">
              Meal submitted successfully!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Input */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Picture Input */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Picture of the meal
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300"
            />
            {formData.image && (
              <p className="mt-2 text-sm text-gray-500">
                File selected: {formData.image.name}
              </p>
            )}
          </div>

          {/* Meal Name Input */}
          <div>
            <label
              htmlFor="mealName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name of the food/meal
            </label>
            <input
              type="text"
              id="mealName"
              name="mealName"
              value={formData.mealName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Meal Type Input */}
          <div>
            <label
              htmlFor="mealType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              What kind of meal is it? (Breakfast, Lunch, Dinner, Snack, etc.)
            </label>
            <input
              type="text"
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex w-full justify-center mt-6">
            <button
              type="submit"
              className="w-full py-3 px-8 text-lg font-semibold rounded-xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
