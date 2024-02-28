import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import fetchGitHubReleases from "@/app/api/leaderboard/functions";
import Image from "next/image";

export default async function ReleaseSection() {
  const releases = await fetchGitHubReleases(4);

  if (releases.length === 0) {
    return (
      <span className="flex w-full justify-center py-10 text-lg font-semibold text-gray-600 dark:text-gray-400">
        No recent releases
      </span>
    );
  }

  return (
    <div className="grid grid-cols-1">
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {releases.map((release) => (
          <li key={release.createdAt} className="group mb-10 ms-4">
            <div className="absolute left-[-18px] mt-1.5">
              <Image
                src={release.author.avatarUrl}
                alt="author-avatar"
                height={40}
                width={40}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-gray-200 transition-all duration-200 ease-in-out group-hover:scale-125 group-hover:ring-2 dark:ring-gray-800 group-hover:dark:ring-white/50"
              />
            </div>
            <div className="ml-10">
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-400">
                <Link
                  href={`https://github.com/${release.author.login}`}
                  target="_blank"
                  className="font-semibold text-gray-300"
                >
                  {release.author.login}
                </Link>{" "}
                released a new version on{" "}
                {new Date(release.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                {release.repository} - {release.name}
              </h3>
              <div className="mt-3 text-gray-400">
                <p>Contributors - </p>
                <div className="mt-3 flex gap-2">
                  <div className="grid grid-cols-3 gap-3 md:grid-cols-10">
                    {release.mentions.nodes.map((contributor) => (
                      <Link
                        href={`https://github.com/${contributor.login}`}
                        target="_blank"
                        className="flex"
                        key={contributor.avatarUrl}
                      >
                        <Image
                          src={contributor.avatarUrl}
                          alt={contributor.login}
                          height={40}
                          width={40}
                          className="h-10 w-10 rounded-full"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href={release.url}
                className="mt-5 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                target="_blank"
              >
                Open in Github{" "}
                <span className="ml-1">
                  <IoIosArrowRoundForward size={26} />
                </span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
