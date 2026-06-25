import { contentImageUrls } from "@/utils/community-images";

export default function CommunityQuestionImages({
  question,
  record,
  altPrefix = "Załączone zdjęcie",
  className = "",
  thumbnailClassName = "",
  singleClassName = "max-w-full rounded-lg",
}) {
  const urls = contentImageUrls(record ?? question);
  if (!urls.length) return null;

  if (urls.length === 1) {
    return (
      <img
        src={urls[0]}
        alt={`${altPrefix}`}
        className={`${singleClassName} ${className}`.trim()}
      />
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${className}`.trim()}
    >
      {urls.map((url, index) => (
        <a
          key={`${url}-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <img
            src={url}
            alt={`${altPrefix} ${index + 1}`}
            className={`h-full w-full object-cover ${thumbnailClassName || "max-h-48"}`.trim()}
          />
        </a>
      ))}
    </div>
  );
}
