export type AccessEvent = {
  id: string;
  viewerName: string;
  accessedAt: string;
  ip: string | null;
  userAgent: string | null;
  path: string;
};

export type CreateAccessEventInput = {
  viewerName: string;
  ip?: string | null;
  userAgent?: string | null;
  path?: string;
};
