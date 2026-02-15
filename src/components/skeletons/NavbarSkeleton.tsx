const NavbarSkeleton = () => {
  return (
    <nav className="p-4 drop-shadow-md fixed top-0 w-full backdrop-blur-md bg-bg/70 z-50">
      <div className="max-w-7xl w-full px-4 md:px-10 mx-auto flex justify-between items-center gap-4">
        {/* Logo Skeleton */}
        <div className="flex gap-2 justify-center items-center shrink-0">
          <div className="w-7 h-7 bg-gray-700 rounded animate-pulse" />
          <div className="w-28 h-6 bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Search Bar Skeleton (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <div className="w-full h-10 bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Desktop Navigation Links Skeleton */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <div className="w-20 h-10 bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-10 bg-gray-700 rounded animate-pulse" />
          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Mobile Menu Button Skeleton */}
        <div className="md:hidden">
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </nav>
  );
};

export default NavbarSkeleton;
