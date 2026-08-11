"use client";

interface Props {
  milestone: any;
}

export default function MilestoneSection({
  milestone,
}: Props) {
  if (!milestone) return null;

  return (
    <section className="py-24">

      <div className="text-center mb-16">

        <h2 className="text-5xl playfair font-bold">
          {milestone.title}
        </h2>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {milestone.KeyMilestonesOptions?.map(
          (item: any) => (
            <div
              key={item.id}
              className="bg-[#d2ab67] text-white p-10 rounded-xl text-center shadow-xl"
            >
              <h3 className="text-5xl font-bold mb-5">
                {item.Year}
              </h3>

              <p className="text-lg">
                {item.Key}
              </p>
            </div>
          )
        )}

      </div>

    </section>
  );
}