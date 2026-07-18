import Image from "next/image";
import Link from "next/link";

import type { FeaturedImageData } from "@/lib/types";
import { cn } from "@/lib/utils";

type PostImageProps = {
  image: FeaturedImageData | null;
  title: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function PostImage({
  image,
  title,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: PostImageProps) {
  if (!image?.src) {
    return (
      <div
        className={cn("image-fallback", className)}
        role="img"
        aria-label={`No featured image for ${title}`}
      >
        <span className="image-fallback-mark" aria-hidden="true">
          AAM
        </span>
        <span className="image-fallback-label">Asghar Ali Mubarak</span>
      </div>
    );
  }

  return (
    <div className={cn("post-image-frame", className)}>
      <Image
        src={image.src}
        alt={image.alt || title}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

type LinkedPostImageProps = PostImageProps & {
  href: string;
};

export function LinkedPostImage({ href, className, ...props }: LinkedPostImageProps) {
  return (
    <Link
      href={href}
      className={cn("block overflow-hidden media-link", className)}
      tabIndex={-1}
      aria-hidden="true"
    >
      <PostImage {...props} className="h-full w-full" />
    </Link>
  );
}
