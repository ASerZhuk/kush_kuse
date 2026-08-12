import type { InputProps } from "@/types/input";

export default function Input({
  error = false,
  errorMessage,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full max-w-100">
      <input
        aria-invalid={error}
        className={`h-12 w-full rounded-[40px] border bg-grey py-1 pl-4 pr-1 text-body-s text-dark placeholder:text-grey-300 focus:placeholder:text-grey-100 outline-none ${error ? "border-error-100" : "border-transparent"} ${className}`}
        {...props}
      />
      {error && errorMessage && (
        <span className="mt-1 block pl-4 text-caption-s uppercase text-error-200">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
