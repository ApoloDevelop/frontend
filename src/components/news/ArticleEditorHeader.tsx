interface ArticleEditorHeaderProps {
  isEdit: boolean;
}

export function ArticleEditorHeader({ isEdit }: ArticleEditorHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">
        {isEdit ? "Editar artículo" : "Nuevo artículo"}
      </h1>
      <p className="text-gray-600">
        {isEdit
          ? "Modifica el contenido y guarda los cambios."
          : "Redacta un nuevo artículo para la portada."}
      </p>
    </div>
  );
}
