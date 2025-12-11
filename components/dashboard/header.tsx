import { Bell, Search, UserCircle } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center text-gray-400">
        <Search className="w-5 h-5" />
        <span className="ml-3 text-sm font-roboto">Search students or exams...</span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-[#146939] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#17321A] font-montserrat">Prof. Smith</p>
            <p className="text-xs text-gray-500 font-roboto">Science Dept.</p>
          </div>
          <UserCircle className="w-9 h-9 text-[#00954f]" />
        </div>
      </div>
    </header>
  )
}