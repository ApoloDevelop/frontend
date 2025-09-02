import {
  getArtistData,
  getCurrentUserData,
  useArtistParams,
} from "@/hooks/artists";
import {
  ArtistHero,
  ArtistHeader,
  ArtistMainContent,
  ArtistSidebar,
} from "@/components/artist";
import { ErrorPage } from "@/components/system/ErrorPage";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artist: string }>;
}) {
  const { artist: slug } = await params;
  const artistName = useArtistParams(slug);

  try {
    // Get all artist data using custom hook
    const {
      artistData,
      reviewCounts,
      item,
      averages,
      details,
      albums,
      topTracks,
      lastRelease,
      bio,
      genres,
      relatedArtists,
    } = await getArtistData(artistName);

    // Get user data using custom hook
    const { authUser } = await getCurrentUserData();
    console.log("Auth User:", authUser);

    return (
      <div className="container mx-auto">
        <ArtistHero artistData={artistData} />

        <ArtistHeader
          artistData={artistData}
          details={details}
          item={item}
          authUser={authUser}
        />

        {/* Contenido principal */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-10">
          <ArtistMainContent
            averages={averages}
            reviewCounts={reviewCounts}
            item={item}
            artistName={artistData.name}
            authUser={authUser}
            details={details}
            genres={genres}
            bio={bio}
            albums={albums}
            slug={slug}
            relatedArtists={relatedArtists}
          />

          <ArtistSidebar
            lastRelease={lastRelease}
            topTracks={topTracks}
            artistId={artistData.id}
            slug={slug}
            user={authUser}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading artist data:", error);

    // Determinar el mensaje de error específico
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al cargar los datos del artista";

    return (
      <ErrorPage
        message={errorMessage}
        title="Artista no disponible"
        icon="🎤"
      />
    );
  }
}
