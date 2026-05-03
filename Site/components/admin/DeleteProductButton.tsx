"use client";

import { useFormStatus } from "react-dom";

interface Props {
  onDelete: (formData: FormData) => Promise<void>;
  id: string;
}

export default function DeleteProductButton({ onDelete, id }: Props) {
  const { pending } = useFormStatus();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm("Вы уверены, что хотите полностью удалить этот товар? Это действие необратимо.")) {
      e.preventDefault();
    }
  };

  return (
    <button
      formAction={onDelete}
      onClick={handleClick}
      disabled={pending}
      className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      <input type="hidden" name="id" value={id} />
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {pending ? "Удаление..." : "Удалить товар"}
    </button>
  );
}