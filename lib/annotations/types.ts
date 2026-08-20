export type Anchor = {
  sectionId: string;
  exact: string;
  prefix: string;
  suffix: string;
  startOffset: number;
};

export type Annotation = {
  id: string;
  docVersion: string;
  sectionId: string;
  anchor: Anchor;
  body: string;
  authorName: string;
  parentId: string | null;
  resolvedAt: string | null;
  createdAt: string;
};

export type CreateAnnotationInput = {
  sectionId: string;
  anchor: Anchor;
  body: string;
  authorName: string;
  parentId?: string | null;
};

export interface AnnotationStore {
  list(): Promise<Annotation[]>;
  create(input: CreateAnnotationInput): Promise<Annotation>;
  update(id: string, patch: Partial<Pick<Annotation, "body" | "resolvedAt">>): Promise<Annotation>;
  delete(id: string): Promise<void>;
  subscribe(callback: (annotations: Annotation[]) => void): () => void;
}
