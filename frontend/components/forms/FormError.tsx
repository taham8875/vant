interface FormErrorProps {
  message?: string;
  errors?: string[];
}

export function FormError({ message, errors }: FormErrorProps) {
  if (!message && (!errors || errors.length === 0)) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-danger px-4 py-3 rounded-lg mb-4">
      {message && <p>{message}</p>}
      {errors && errors.map((err, i) => <p key={i}>{err}</p>)}
    </div>
  );
}
