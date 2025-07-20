"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("auth/register/", form);
      router.push("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.password || err?.response?.data?.detail || "Registration failed";
      setError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="username" onChange={handleChange} placeholder="Username" className="border p-2 rounded" />
        <input name="email" onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" className="border p-2 rounded" />
        <input name="password2" type="password" onChange={handleChange} placeholder="Confirm Password" className="border p-2 rounded" />
        <button className="bg-green-600 text-white py-2 px-4 rounded">Register</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
