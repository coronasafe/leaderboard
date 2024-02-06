import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
  return (
    <header className="max-w-6xl mx-auto py-4 lg:py-8 px-4 xl:px-0 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex justify-between items-center">
        <Link className="inline-block cursor-pointer" href="/">
          <h1 className="flex flex-col items-end text-primary-400 cursor-pointer text-4xl">
            {process.env.NEXT_PUBLIC_ORG_NAME || "Open Source"}
            <span className="text-xl font-bold block text-gray-600 dark:text-gray-400 tracking-normal">
              Contributors
            </span>
          </h1>
        </Link>
      </div>
      <ThemeSwitch />
    </header>
  );
}
