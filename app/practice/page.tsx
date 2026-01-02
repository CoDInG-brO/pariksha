
export default function Practice() {
  return (
    <div className="max-w-3xl">
      <div className="bg-surface rounded-xl p-6 border border-white/10">
        <h2 className="mb-4">Which HTTP status code means Unauthorized?</h2>
        <ul className="space-y-3">
          {["200", "401", "403", "500"].map(o => (
            <li key={o} className="p-3 rounded-lg bg-black/30 border border-white/10 hover:bg-accent/10 cursor-pointer">
              {o}
            </li>
          ))}
        </ul>
        <div className="mt-6 p-4 rounded-lg bg-black/30 border border-accent/20">
          <p className="text-sm text-gray-300">
            401 indicates authentication is required or has failed.
          </p>
        </div>
      </div>
    </div>
  );
}
