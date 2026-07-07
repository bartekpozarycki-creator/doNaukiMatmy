import { bannedInsults, bannedVulgarRoots } from "@/utils/content-moderation/banned-terms";
import {
  normalizeText,
  normalizeTextWords,
} from "@/utils/content-moderation/normalize-text";

export const bannedContentMessage =
  "Twój post zawiera niedozwolone słownictwo. Popraw treść i spróbuj ponownie.";

const preciseShortRootPatterns = {
  cip: /(?:^|[^a-z])cip(?:a|e|ie|ka|ke|ki|ko|y|om|ami|ach)?(?:$|[^a-z])/,
  sra: /(?:^|[^a-z])(?:sra|srac|sram|srasz|sraja|sraj|sraka|sraki|srake|srako|srany|srana|srane)(?:$|[^a-z])/,
  huj: /(?:^|[^a-z])huj(?:a|e|em|owi|u|owy|owa|owe|nia|niach)?(?:$|[^a-z])/,
};

const includesAnyRoot = (normalizedCompact, normalizedWords) =>
  bannedVulgarRoots.some((root) => {
    const pattern = preciseShortRootPatterns[root];
    if (pattern) {
      return pattern.test(normalizedWords) || normalizedCompact.includes(root);
    }
    return normalizedCompact.includes(root);
  });

const includesAnyInsult = (normalizedCompact, normalizedWords) =>
  bannedInsults.some((root) => {
    const wordPattern = new RegExp(`(?:^|[^a-z])${root}[a-z]*(?:$|[^a-z])`);
    return wordPattern.test(normalizedWords) || normalizedCompact.includes(root);
  });

export function containsBannedContent(text) {
  const normalizedCompact = normalizeText(text);
  const normalizedWords = normalizeTextWords(text);
  if (!normalizedCompact) return false;
  return (
    includesAnyRoot(normalizedCompact, normalizedWords) ||
    includesAnyInsult(normalizedCompact, normalizedWords)
  );
}

export function assertAllowedContent(text) {
  if (containsBannedContent(text)) {
    throw new Error(bannedContentMessage);
  }
}
