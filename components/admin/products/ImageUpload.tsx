"use client";

import { Upload, X, Image as ImageIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled = false,
}: Props) {
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "upload_preset",
        "unsigned_upload"
      );

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhr4kekdx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Cloudinary upload failed"
        );
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error(
          "Không nhận được URL ảnh"
        );
      }

      onChange(data.secure_url);
    } catch (error) {
      console.error(error);

      alert(
        "Không thể tải hình ảnh lên Cloudinary."
      );
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        Hình ảnh
      </label>

      <label
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-400 transition hover:border-cyan-500 hover:text-cyan-400 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        <Upload className="h-5 w-5" />

        Chọn hình ảnh

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {value ? (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-800">
          <img
            src={value}
            alt="Preview"
            className="h-48 w-full object-cover"
          />

          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled}
            className="absolute right-2 top-2 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-3 flex h-32 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
          <ImageIcon className="h-8 w-8 text-slate-700" />
        </div>
      )}
    </div>
  );
}