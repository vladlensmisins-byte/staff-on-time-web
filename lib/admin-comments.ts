export type AdminComment = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt?: string | null;
};

const MAX_COMMENT_LENGTH = 2000;
const MAX_COMMENTS = 50;

function isAdminComment(value: unknown): value is AdminComment {
  if (!value || typeof value !== "object") return false;
  const comment = value as AdminComment;
  return (
    typeof comment.id === "string" &&
    typeof comment.text === "string" &&
    typeof comment.createdAt === "string"
  );
}

function normalizeComment(comment: AdminComment): AdminComment {
  return {
    id: comment.id,
    text: comment.text.trim().slice(0, MAX_COMMENT_LENGTH),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt ?? null,
  };
}

export function parseAdminComments(
  raw: string | null | undefined,
  fallbackCreatedAt?: string | null,
): AdminComment[] {
  if (!raw?.trim()) return [];

  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(isAdminComment)
        .map(normalizeComment)
        .filter((comment) => comment.text.length > 0)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    } catch {
      return [];
    }
  }

  return [
    normalizeComment({
      id: "legacy-note",
      text: trimmed,
      createdAt: fallbackCreatedAt ?? new Date().toISOString(),
    }),
  ];
}

export function serializeAdminComments(comments: AdminComment[]): string | null {
  if (comments.length === 0) return null;
  return JSON.stringify(comments);
}

function createCommentId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addAdminComment(comments: AdminComment[], text: string): AdminComment[] {
  const trimmed = text.trim().slice(0, MAX_COMMENT_LENGTH);
  if (!trimmed) return comments;
  if (comments.length >= MAX_COMMENTS) {
    throw new Error("Too many comments");
  }

  const next = [
    ...comments,
    {
      id: createCommentId(),
      text: trimmed,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  ];
  return next.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function updateAdminComment(
  comments: AdminComment[],
  commentId: string,
  text: string,
): AdminComment[] {
  const trimmed = text.trim().slice(0, MAX_COMMENT_LENGTH);
  if (!trimmed) {
    throw new Error("Comment text is required");
  }

  let found = false;
  const next = comments.map((comment) => {
    if (comment.id !== commentId) return comment;
    found = true;
    return {
      ...comment,
      text: trimmed,
      updatedAt: new Date().toISOString(),
    };
  });

  if (!found) {
    throw new Error("Comment not found");
  }

  return next;
}

export function deleteAdminComment(comments: AdminComment[], commentId: string): AdminComment[] {
  const next = comments.filter((comment) => comment.id !== commentId);
  if (next.length === comments.length) {
    throw new Error("Comment not found");
  }
  return next;
}

export function getLatestAdminComment(comments: AdminComment[]): AdminComment | null {
  if (comments.length === 0) return null;
  return comments[comments.length - 1];
}
