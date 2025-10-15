"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { client } from "@/lib/supabaseClient";

type FoodEntry = {
  date: string;
  meal_name: string;
  meal_type: string;
  image_url: string;
  imageFile: File | null;
};

export default function EditFoodPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState<FoodEntry>({
    date: "",
    meal_name: "",
    meal_type: "",
    image_url: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchMeal = async () => {
      const { data, error } = await client
        .from("food_tb")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        setFormData({
          date: data.date,
          meal_name: data.meal_name,
          meal_type: data.meal_type,
          image_url: data.image_url,
          imageFile: null,
        });
      }
      setLoading(false);
    };
    fetchMeal();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        imageFile: files && files[0] ? files[0] : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `food_pics/${fileName}`;
      const { data: uploadData, error: uploadError } = await client.storage
        .from("food_bk")
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }
      const { data } = client.storage.from("food_bk").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Unexpected upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    let imageUrl = formData.image_url;
    if (formData.imageFile) {
      const uploadedUrl = await uploadImage(formData.imageFile);
      if (!uploadedUrl) {
        alert("Failed to upload image");
        return;
      }
      imageUrl = uploadedUrl;
    }

    const { error } = await client
      .from("food_tb")
      .update({
        date: formData.date,
        meal_name: formData.meal_name,
        meal_type: formData.meal_type,
        image_url: imageUrl,
        update_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update meal");
    } else {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-4">
          <a href="/dashboard" className="text-sm text-green-600 hover:underline">
            ← Return to dashboard
          </a>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-900 mb-6">
          Edit Entry
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Picture of the meal
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300"
              accept="image/*"
            />
            {formData.imageFile ? (
              <p className="mt-2 text-sm text-gray-500">File selected: {formData.imageFile.name}</p>
            ) : formData.image_url ? (
              <img
                src={formData.image_url}
                alt="Meal"
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            ) : null}
          </div>

          <div>
            <label htmlFor="meal_name" className="block text-sm font-medium text-gray-700 mb-1">
              Name of the food/meal
            </label>
            <input
              type="text"
              id="meal_name"
              name="meal_name"
              value={formData.meal_name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="meal_type" className="block text-sm font-medium text-gray-700 mb-1">
              Which meal is it? (Breakfast, Lunch, Dinner, etc.)
            </label>
            <input
              type="text"
              id="meal_type"
              name="meal_type"
              value={formData.meal_type}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border-2 border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors duration-300 text-black"
              required
            />
          </div>

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