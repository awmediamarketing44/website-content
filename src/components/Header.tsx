export function Header() {
  return (
    <header className="border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F92672] rounded-md flex items-center justify-center font-bold text-sm">
            AW
          </div>
          <span className="font-semibold text-lg">
            aw<span className="text-[#F92672]">media</span>.marketing
          </span>
        </div>
        <span className="text-sm text-gray-500 hidden sm:block">
          Website Content Generator
        </span>
      </div>
    </header>
  );
}
