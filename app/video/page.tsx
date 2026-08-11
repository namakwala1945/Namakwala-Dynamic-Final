// pages/resources/video.tsx
import React from "react";
import Head from "next/head";

const videos = [
  { title: "Production Process", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: "Company Overview", url: "https://www.youtube.com/embed/3JZ_D3ELwOQ" },
];

const VideoPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Video - Your Company</title>
      </Head>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Video Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v, idx) => (
            <div key={idx} className="aspect-video">
              <iframe
                src={v.url}
                title={v.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
              <h2 className="mt-2 text-lg font-medium">{v.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoPage;
