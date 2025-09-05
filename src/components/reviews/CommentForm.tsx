interface CommentFormProps {
  title: string;
  comment: string;
  onTitleChange: (title: string) => void;
  onCommentChange: (comment: string) => void;
}

export function CommentForm({
  title,
  comment,
  onTitleChange,
  onCommentChange,
}: CommentFormProps) {
  return (
    <>
      <input
        type="text"
        placeholder="Título (opcional)"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full border rounded p-2"
      />
      <textarea
        placeholder="Comentario (opcional)"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        className="w-full border rounded p-2"
        rows={3}
      />
    </>
  );
}
