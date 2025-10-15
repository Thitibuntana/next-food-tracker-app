"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client } from "@/lib/supabaseClient";

type UserProfile = {
  userId: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string;
  gender: string;
  image_url: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password || !gender || !imageFile) {
      alert("Please fill all fields and upload a picture.");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await client.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        throw authError ?? new Error("Signup failed");
      }

      const userId = authData.user.id;

      // 2. Upload image to storage bucket `user_bk`
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile_pics/${fileName}`;

      const { error: uploadError } = await client.storage
        .from("user_bk")
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = client.storage
        .from("user_bk")
        .getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      // 3. Insert profile into user_tb
      const { data: profileData, error: profileError } = await client
        .from("user_tb")
        .insert([
          {
            userId,
            email,
            full_name: fullName,
            gender,
            image_url: imageUrl,
          },
        ])
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      alert(
        "Registration successful. Please check your email to confirm (if required)."
      );
      router.push("/login");
    } catch (err: unknown) {
      console.error("Register error:", err);
      if (err instanceof Error) {
        alert("Error: " + err.message);
      } else if (typeof err === "string") {
        alert("Error: " + err);
      } else if (typeof err === "object" && err !== null) {
        // try to get a message property
        const maybeAny = err as unknown as { message?: string };
        if (maybeAny.message && typeof maybeAny.message === "string") {
          alert("Error: " + maybeAny.message);
        } else {
          alert("An unknown error occurred.");
        }
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-4">
          <Link href="/" className="text-sm text-green-600 hover:underline">
            ← Return to home page
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-center text-green-900 mb-6">
          Create an Account!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              required
            />
            <span
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            ></span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-gray-700">Other</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="mt-4 w-24 h-24 object-cover rounded-full border border-gray-300"
              />
            )}
          </div>
          <div className="flex justify-between space-x-4 pt-4">
            <button
              type="submit"
              className="w-full py-3 px-8 text-lg font-semibold rounded-xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-all duration-300 transform"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
