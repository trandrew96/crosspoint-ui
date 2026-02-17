interface Video {
  name?: string;
  video_id?: string;
}

type Props = {
  videos: Video[];
};

const GameVideoGallery = (props: Props) => {
  if (!props.videos || props.videos.length === 0) {
    return <p className="text-slate-400">No videos available.</p>;
  }

  return (
    <>
      <div className="flex overflow-x-auto scrollbar-hide gap-4 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible">
        {props.videos?.map((video: any, index: number) => (
          <a
            key={index}
            href={`https://www.youtube.com/watch?v=${video.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-64 md:w-auto"
          >
            <div className="w-full">
              <img
                className="w-full object-cover rounded-lg border-2 border-slate-700 hover:border-slate-500 transition-colors"
                src={`https://img.youtube.com/vi/${video.video_id}/0.jpg`}
                alt={video.name || `Video ${index + 1}`}
              />
              <p className="mt-2 text-center text-sm truncate">{video.name}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default GameVideoGallery;
