interface ProfilePhotoErrorProps {
  photoError: string | null;
}

export const ProfilePhotoError = ({ photoError }: ProfilePhotoErrorProps) => {
  if (!photoError) return null;

  return (
    <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {photoError}
    </div>
  );
};
