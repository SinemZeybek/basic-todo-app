export default function ErrorMessage({ message }) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-fit mx-auto mt-6">
        <span className="block sm:inline">{message || 'An unexpected error occurred.'}</span>
      </div>
    )
  }
  