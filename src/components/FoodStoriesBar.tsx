import React from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_STORIES } from '../data/mockData';
import { Play } from 'lucide-react';

export const FoodStoriesBar: React.FC = () => {
  const { setActiveStoryIndex } = useApp();

  return (
    <section className="w-full overflow-hidden border-b border-stone-800/80 bg-stone-900/50 py-5 sm:py-6">

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">

        {/* =======================================================
            HEADER
        ======================================================== */}
        <div className="mb-4 flex flex-col items-center justify-center gap-1.5 text-center sm:mb-5">

          {/* TITLE */}
          <div className="flex items-center justify-center gap-2">

            {/* LIVE DOT */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
            </span>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-stone-200

                sm:text-xs
                sm:tracking-widest
              "
            >
              Kitchen Live Stories & Chef Specials
            </span>

          </div>

          {/* SUBTITLE */}
          <span
            className="
              text-[10px]
              font-medium
              text-stone-500

              sm:text-xs
              sm:text-stone-400
            "
          >
            Tap to watch fresh bites
          </span>

        </div>


        {/* =======================================================
            STORIES SCROLLER

            Outer wrapper handles overflow.
            Inner wrapper uses w-max + mx-auto so stories
            stay centered when there is available space.
        ======================================================== */}
        <div
          className="
            no-scrollbar
            w-full
            overflow-x-auto
            overflow-y-hidden
            overscroll-x-contain
            pb-1
          "
        >

          <div
            className="
              mx-auto
              flex
              w-max
              min-w-full
              items-start
              justify-center
              gap-3
              px-1

              sm:gap-4
              sm:px-2
            "
          >

            {FOOD_STORIES.map((story, index) => (

              <button
                key={story.id}
                type="button"
                onClick={() => setActiveStoryIndex(index)}
                className="
                  group
                  flex
                  w-[74px]
                  shrink-0
                  flex-col
                  items-center
                  gap-1.5
                  rounded-2xl
                  text-center
                  outline-none

                  sm:w-[82px]
                  sm:gap-2

                  focus-visible:ring-2
                  focus-visible:ring-amber-400
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-stone-900
                "
              >

                {/* =================================================
                    STORY IMAGE
                ================================================== */}
                <div
                  className="
                    relative
                    h-[72px]
                    w-[72px]
                    rounded-[20px]
                    bg-gradient-to-tr
                    from-amber-500
                    via-rose-500
                    to-purple-600
                    p-[2px]
                    shadow-lg
                    shadow-rose-950/30
                    transition-all
                    duration-300

                    group-hover:scale-105
                    group-hover:shadow-rose-950/50

                    sm:h-[80px]
                    sm:w-[80px]
                    sm:rounded-[21px]
                  "
                >

                  {/* INNER IMAGE FRAME */}
                  <div
                    className="
                      relative
                      h-full
                      w-full
                      overflow-hidden
                      rounded-[17px]
                      border-2
                      border-stone-950
                      bg-stone-800

                      sm:rounded-[18px]
                    "
                  >

                    {/* IMAGE */}
                    <img
                      src={story.mediaUrl}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        ease-out

                        group-hover:scale-110
                      "
                    />

                    {/* DARK GRADIENT */}
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-stone-950/80
                        via-transparent
                        to-transparent
                      "
                    />

                    {/* PLAY BUTTON */}
                    <div
                      className="
                        absolute
                        bottom-1.5
                        left-1/2
                        flex
                        h-5
                        w-5
                        -translate-x-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-stone-950/65
                        backdrop-blur-sm
                        transition
                        duration-300

                        group-hover:scale-110
                        group-hover:bg-amber-500
                      "
                    >
                      <Play
                        className="
                          h-2.5
                          w-2.5
                          fill-white
                          text-white

                          group-hover:fill-stone-950
                          group-hover:text-stone-950
                        "
                      />
                    </div>

                  </div>

                </div>


                {/* =================================================
                    RESTAURANT NAME
                ================================================== */}
                <span
                  className="
                    w-full
                    truncate
                    px-0.5
                    text-[10px]
                    font-semibold
                    leading-tight
                    text-stone-300
                    transition-colors
                    duration-200

                    group-hover:text-amber-400

                    sm:text-[11px]
                  "
                >
                  {story.restaurantName}
                </span>

              </button>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
};