export default function Footer() {
  return (
    <footer className="bg-tajiree-black border-t border-gray-800 mt-20">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
            Tajiree<span className="text-tajiree-teal">Auto</span>
          </span>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0">
            <li><a href="#about" className="hover:underline me-4 md:me-6">About</a></li>
            <li><a href="#inventory" className="hover:underline me-4 md:me-6">Inventory</a></li>
            <li><a href="/admin" className="hover:underline">Staff Login</a></li>
          </ul>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center">
          © {new Date().getFullYear()} TajireeAuto™. Mombasa, Kenya.
        </span>
      </div>
    </footer>
  )
}