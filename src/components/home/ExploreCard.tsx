import Link from "next/link";

interface ExploreCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkText: string;
}

export function ExploreCard({
  icon,
  title,
  description,
  href,
  linkText,
}: ExploreCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800/30 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">{description}</p>
      <Link
        href={href}
        className="block w-full border border-purple-200 bg-white text-black hover:bg-purple-50 dark:border-purple-700 dark:bg-slate-800 dark:text-white dark:hover:bg-purple-900/20 rounded-lg px-4 py-2 transition-all duration-200 font-medium text-center"
      >
        {linkText}
      </Link>
    </div>
  );
}
