import Link from "next/link";

const MenuItems = () => {
  return (
    <div className="flex flex-row items-center justify-between gap-2 rounded bg-secondary-100 px-1 py-1 font-semibold dark:bg-secondary-700/50 md:rounded-full md:px-4 md:py-2">
      <Link href="/leaderboard">
        <p className="cursor-pointer p-1 text-sm hover:text-primary-500 hover:underline hover:dark:text-primary-300 md:p-2 md:text-base">
          Leaderboard
        </p>
      </Link>
      <Link href="/people">
        <p className="cursor-pointer p-1 text-sm hover:text-primary-500  hover:underline hover:dark:text-primary-300 md:p-2 md:text-base">
          Contributors
        </p>
      </Link>
      <Link href="/projects">
        <p className="cursor-pointer p-1 text-sm hover:text-primary-500  hover:underline hover:dark:text-primary-300 md:p-2 md:text-base">
          Projects
        </p>
      </Link>
      <Link href="/feed">
        <p className="cursor-pointer p-1 text-sm hover:text-primary-500  hover:underline hover:dark:text-primary-300 md:p-2 md:text-base">
          Feed
        </p>
      </Link>
      <Link href="/releases">
        <p className="cursor-pointer p-1 text-sm hover:text-primary-500  hover:underline hover:dark:text-primary-300 md:p-2 md:text-base">
          Releases
        </p>
      </Link>
    </div>
  );
};

export default MenuItems;
