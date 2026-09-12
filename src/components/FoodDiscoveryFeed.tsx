import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useApp } from '../context/AppContext';
import {
  FOOD_VIDEOS,
  RESTAURANTS_DATA,
} from '../data/mockData';

import {
  Heart,
  Share2,
  ShoppingBag,
  Volume2,
  VolumeX,
  Flame,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
} from 'lucide-react';

export const FoodDiscoveryFeed: React.FC = () => {
  const {
    addToCart,
    setSelectedRestaurant,
    setCurrentView,
    showToast,
  } = useApp();

  const [likes, setLikes] = useState<{ [id: string]: number }>({
    'vid-1': 1420,
    'vid-2': 2180,
    'vid-3': 980,
  });

  const [userLiked, setUserLiked] = useState<{
    [id: string]: boolean;
  }>({});

  const [isMuted, setIsMuted] = useState(true);

  const [playing, setPlaying] = useState<{
    [id: string]: boolean;
  }>({});

  const videoRefs = useRef<{
    [id: string]: HTMLVideoElement | null;
  }>({});

  /**
   * ---------------------------------------------------------
   * VIDEO SOURCE
   * ---------------------------------------------------------
   *
   * Files should be inside:
   *
   * public/
   * ├── burger.mp4
   * ├── koth.mp4
   * └── pizza.mp4
   *
   * Because they are inside public, use:
   *
   * /burger.mp4
   * /koth.mp4
   * /pizza.mp4
   */

  const getVideoSource = (id: string) => {
    switch (id) {
      case 'vid-1':
        return '/burger.mp4';

      case 'vid-2':
        return '/koth.mp4';

      case 'vid-3':
        return '/pizza.mp4';

      default:
        return '';
    }
  };

  /**
   * ---------------------------------------------------------
   * LIKE
   * ---------------------------------------------------------
   */

  const handleLike = (id: string) => {
    setUserLiked((prev) => {
      const alreadyLiked = !!prev[id];

      setLikes((prevLikes) => ({
        ...prevLikes,
        [id]:
          (prevLikes[id] || 0) +
          (alreadyLiked ? -1 : 1),
      }));

      return {
        ...prev,
        [id]: !alreadyLiked,
      };
    });
  };

  /**
   * ---------------------------------------------------------
   * DOUBLE TAP LIKE
   * ---------------------------------------------------------
   */

  const handleDoubleTap = (id: string) => {
    if (!userLiked[id]) {
      handleLike(id);
    }
  };

  /**
   * ---------------------------------------------------------
   * ORDER DISH
   * ---------------------------------------------------------
   */

  const handleOrderVideoDish = (
    video: typeof FOOD_VIDEOS[0]
  ) => {
    const parentRest = RESTAURANTS_DATA.find(
      (restaurant) =>
        restaurant.id === video.restaurantId
    );

    if (!parentRest) return;

    const dish = parentRest.menuItems.find(
      (item) => item.id === video.dishId
    );

    if (dish) {
      addToCart(dish);
      showToast(
        `${video.dishName} added to cart 🛍️`,
        'success'
      );
      return;
    }

    setSelectedRestaurant(parentRest);
    setCurrentView('restaurant-detail');
  };

  /**
   * ---------------------------------------------------------
   * SHARE
   * ---------------------------------------------------------
   */

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'CraveVerse Food Reel',
          text: 'Check out this delicious food reel!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard?.writeText(
          window.location.href
        );

        showToast(
          'Food reel link copied! 📹',
          'success'
        );
      }
    } catch {
      // User cancelled native share.
    }
  };

  /**
   * ---------------------------------------------------------
   * MUTE / UNMUTE ALL VIDEOS
   * ---------------------------------------------------------
   */

  const toggleMute = () => {
    const nextMuted = !isMuted;

    setIsMuted(nextMuted);

    Object.values(videoRefs.current).forEach(
      (video) => {
        if (video) {
          video.muted = nextMuted;
        }
      }
    );
  };

  /**
   * ---------------------------------------------------------
   * PLAY / PAUSE
   * ---------------------------------------------------------
   */

  const togglePlay = (
    id: string
  ) => {
    const video = videoRefs.current[id];

    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setPlaying((prev) => ({
            ...prev,
            [id]: true,
          }));
        })
        .catch(() => {});
    } else {
      video.pause();

      setPlaying((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  /**
   * ---------------------------------------------------------
   * AUTO PLAY WHEN REEL ENTERS VIEW
   *
   * Instagram-style behavior.
   * Only the visible reel plays.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const videos = Object.values(
      videoRefs.current
    ).filter(Boolean) as HTMLVideoElement[];

    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video =
            entry.target as HTMLVideoElement;

          const id = video.dataset.reelId;

          if (!id) return;

          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.65
          ) {
            video.muted = isMuted;

            video
              .play()
              .then(() => {
                setPlaying((prev) => ({
                  ...prev,
                  [id]: true,
                }));
              })
              .catch(() => {});
          } else {
            video.pause();

            setPlaying((prev) => ({
              ...prev,
              [id]: false,
            }));
          }
        });
      },
      {
        threshold: [
          0.2,
          0.65,
          0.9,
        ],
      }
    );

    videos.forEach((video) =>
      observer.observe(video)
    );

    return () => observer.disconnect();
  }, [FOOD_VIDEOS, isMuted]);

  /**
   * ---------------------------------------------------------
   * KEYBOARD SUPPORT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'm') {
        toggleMute();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
  }, [isMuted]);

  return (
    <main
      className="
        w-full
        min-h-screen
        bg-stone-950
        text-stone-100
        overflow-x-hidden
      "
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section
        className="
          w-full
          px-4
          sm:px-6
          lg:px-8
          pt-5
          sm:pt-7
          lg:pt-8
          pb-4
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-3xl
            text-center
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-1.5
              px-3
              py-1.5
              rounded-full
              bg-rose-500/10
              border
              border-rose-500/25
              text-rose-400
              text-[10px]
              sm:text-xs
              font-bold
              uppercase
              tracking-[0.16em]
            "
          >
            <Sparkles className="w-3.5 h-3.5" />

            <span>
              Kitchen Sizzles & Food Reels
            </span>
          </div>

          <h1
            className="
              mt-3
              font-display
              font-black
              text-2xl
              sm:text-3xl
              lg:text-4xl
              text-white
              tracking-tight
            "
          >
            Discover Food in Motion
          </h1>

          <p
            className="
              mt-1.5
              mx-auto
              max-w-xl
              text-[11px]
              sm:text-xs
              lg:text-sm
              leading-relaxed
              text-stone-400
            "
          >
            Swipe through real kitchen sizzles,
            cheese pulls & woodfire ovens.
            Tap to order in one click.
          </p>
        </div>
      </section>

      {/* =====================================================
          REELS AREA
      ====================================================== */}

      <section
        className="
          w-full
          px-0
          sm:px-4
          lg:px-6
          pb-8
          sm:pb-10
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[720px]
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              gap-5
              sm:gap-7
              lg:gap-8
            "
          >
            {FOOD_VIDEOS.map(
              (reel) => {
                const isLiked =
                  !!userLiked[reel.id];

                const likeCount =
                  likes[reel.id] || 0;

                const isPlaying =
                  !!playing[reel.id];

                return (
                  <article
                    key={reel.id}
                    className="
                      relative
                      w-full

                      /*
                       * Mobile:
                       * Almost full screen
                       *
                       * Desktop:
                       * Controlled reel size
                       */
                      h-[calc(100svh-120px)]
                      min-h-[560px]
                      max-h-[820px]

                      sm:h-[min(82svh,760px)]
                      sm:min-h-[600px]

                      lg:h-[min(82vh,760px)]

                      overflow-hidden

                      bg-stone-900

                      sm:rounded-[28px]
                      lg:rounded-[30px]

                      border-0
                      sm:border
                      sm:border-stone-800

                      shadow-none
                      sm:shadow-[0_25px_80px_rgba(0,0,0,0.55)]

                      isolate
                    "
                  >
                    {/* =================================================
                        VIDEO
                    ================================================== */}

                    <video
                      ref={(element) => {
                        videoRefs.current[
                          reel.id
                        ] = element;
                      }}
                      data-reel-id={reel.id}
                      src={getVideoSource(
                        reel.id
                      )}
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full

                        object-cover

                        bg-black

                        select-none
                      "
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="metadata"
                      onPlay={() =>
                        setPlaying(
                          (prev) => ({
                            ...prev,
                            [reel.id]: true,
                          })
                        )
                      }
                      onPause={() =>
                        setPlaying(
                          (prev) => ({
                            ...prev,
                            [reel.id]: false,
                          })
                        )
                      }
                      onDoubleClick={() =>
                        handleDoubleTap(
                          reel.id
                        )
                      }
                    />

                    {/* =================================================
                        VIDEO OVERLAY
                    ================================================== */}

                    <div
                      className="
                        absolute
                        inset-0
                        pointer-events-none
                        bg-gradient-to-b
                        from-black/45
                        via-transparent
                        to-black/90
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-x-0
                        top-0
                        h-40
                        pointer-events-none
                        bg-gradient-to-b
                        from-black/45
                        to-transparent
                      "
                    />

                    {/* =================================================
                        TOP BAR
                    ================================================== */}

                    <div
                      className="
                        absolute
                        top-0
                        left-0
                        right-0
                        z-20

                        px-3
                        sm:px-5
                        lg:px-6

                        pt-[max(14px,env(safe-area-inset-top))]
                        sm:pt-5

                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      {/* Restaurant */}

                      <button
                        onClick={() => {
                          const rest =
                            RESTAURANTS_DATA.find(
                              (r) =>
                                r.id ===
                                reel.restaurantId
                            );

                          if (rest) {
                            setSelectedRestaurant(
                              rest
                            );

                            setCurrentView(
                              'restaurant-detail'
                            );
                          }
                        }}
                        className="
                          min-w-0
                          max-w-[75%]

                          flex
                          items-center
                          gap-1.5

                          px-3
                          py-2

                          rounded-full

                          bg-black/65
                          backdrop-blur-xl

                          border
                          border-white/15

                          text-white
                          text-[10px]
                          sm:text-xs
                          font-bold

                          shadow-xl

                          hover:bg-black/80
                          hover:border-amber-400/50

                          transition

                          cursor-pointer
                        "
                      >
                        <Flame
                          className="
                            w-3.5
                            h-3.5
                            shrink-0
                            text-amber-400
                          "
                        />

                        <span
                          className="
                            truncate
                          "
                        >
                          {reel.restaurantName}
                        </span>

                        <ArrowRight
                          className="
                            w-3
                            h-3
                            shrink-0
                            text-stone-400
                          "
                        />
                      </button>

                      {/* Sound */}

                      <button
                        onClick={
                          toggleMute
                        }
                        className="
                          shrink-0

                          w-10
                          h-10

                          sm:w-11
                          sm:h-11

                          rounded-full

                          bg-black/65
                          backdrop-blur-xl

                          border
                          border-white/15

                          flex
                          items-center
                          justify-center

                          text-white

                          hover:bg-black/80
                          hover:scale-105

                          active:scale-95

                          transition

                          cursor-pointer
                        "
                        aria-label={
                          isMuted
                            ? 'Unmute video'
                            : 'Mute video'
                        }
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        )}
                      </button>
                    </div>

                    {/* =================================================
                        CENTER PLAY INDICATOR
                    ================================================== */}

                    {!isPlaying && (
                      <button
                        onClick={() =>
                          togglePlay(
                            reel.id
                          )
                        }
                        className="
                          absolute
                          left-1/2
                          top-1/2

                          -translate-x-1/2
                          -translate-y-1/2

                          z-20

                          w-16
                          h-16

                          sm:w-20
                          sm:h-20

                          rounded-full

                          bg-black/55
                          backdrop-blur-md

                          border
                          border-white/20

                          flex
                          items-center
                          justify-center

                          text-white

                          shadow-2xl

                          cursor-pointer
                        "
                      >
                        <Play
                          className="
                            w-7
                            h-7
                            sm:w-8
                            sm:h-8
                            ml-1
                            fill-white
                          "
                        />
                      </button>
                    )}

                    {/* =================================================
                        RIGHT ACTION RAIL
                    ================================================== */}

                    <div
                      className="
                        absolute

                        right-2.5
                        sm:right-4
                        lg:right-5

                        bottom-[180px]
                        sm:bottom-[175px]
                        lg:bottom-[180px]

                        z-30

                        flex
                        flex-col
                        items-center

                        gap-3
                        sm:gap-4
                      "
                    >
                      {/* LIKE */}

                      <button
                        onClick={() =>
                          handleLike(
                            reel.id
                          )
                        }
                        className="
                          group
                          flex
                          flex-col
                          items-center
                          gap-1

                          cursor-pointer
                        "
                      >
                        <div
                          className="
                            w-10
                            h-10
                            sm:w-11
                            sm:h-11

                            rounded-full

                            bg-black/65
                            backdrop-blur-xl

                            border
                            border-white/15

                            flex
                            items-center
                            justify-center

                            shadow-xl

                            transition

                            group-hover:scale-110
                            group-active:scale-95
                          "
                        >
                          <Heart
                            className={`
                              w-5
                              h-5
                              sm:w-5.5
                              sm:h-5.5
                              transition
                              ${
                                isLiked
                                  ? 'fill-rose-500 text-rose-500 scale-110'
                                  : 'text-white'
                              }
                            `}
                          />
                        </div>

                        <span
                          className="
                            text-[10px]
                            sm:text-[11px]
                            font-bold
                            text-white
                            drop-shadow-lg
                          "
                        >
                          {likeCount}
                        </span>
                      </button>

                      {/* SHARE */}

                      <button
                        onClick={
                          handleShare
                        }
                        className="
                          group
                          flex
                          flex-col
                          items-center
                          gap-1

                          cursor-pointer
                        "
                      >
                        <div
                          className="
                            w-10
                            h-10
                            sm:w-11
                            sm:h-11

                            rounded-full

                            bg-black/65
                            backdrop-blur-xl

                            border
                            border-white/15

                            flex
                            items-center
                            justify-center

                            shadow-xl

                            transition

                            group-hover:scale-110
                            group-active:scale-95
                          "
                        >
                          <Share2
                            className="
                              w-5
                              h-5
                              text-white
                            "
                          />
                        </div>

                        <span
                          className="
                            text-[10px]
                            sm:text-[11px]
                            font-bold
                            text-white
                            drop-shadow-lg
                          "
                        >
                          Share
                        </span>
                      </button>

                      {/* MUTE */}

                      <button
                        onClick={
                          toggleMute
                        }
                        className="
                          group

                          w-10
                          h-10
                          sm:w-11
                          sm:h-11

                          rounded-full

                          bg-black/65
                          backdrop-blur-xl

                          border
                          border-white/15

                          flex
                          items-center
                          justify-center

                          shadow-xl

                          hover:scale-110
                          active:scale-95

                          transition

                          cursor-pointer
                        "
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        )}
                      </button>
                    </div>

                    {/* =================================================
                        BOTTOM CONTENT
                    ================================================== */}

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        bottom-0
                        z-20

                        px-3
                        sm:px-5
                        lg:px-6

                        pb-[max(14px,env(safe-area-inset-bottom))]
                        sm:pb-5

                        pr-16
                        sm:pr-20
                      "
                    >
                      {/* Title */}

                      <div
                        className="
                          mb-3
                          sm:mb-4
                        "
                      >
                        <h3
                          className="
                            font-display
                            font-extrabold

                            text-base
                            sm:text-lg
                            lg:text-xl

                            leading-snug

                            text-white

                            drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]
                          "
                        >
                          {reel.title}
                        </h3>

                        {/* Tags */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-x-2
                            gap-y-1

                            mt-1.5
                          "
                        >
                          {reel.tags.map(
                            (
                              tag,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                className="
                                  text-[9px]
                                  sm:text-[10px]

                                  text-amber-300

                                  font-semibold

                                  drop-shadow-lg
                                "
                              >
                                #{tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* =================================================
                          ORDER CARD
                      ================================================== */}

                      <div
                        className="
                          w-full

                          rounded-2xl
                          sm:rounded-[20px]

                          bg-stone-950/90
                          backdrop-blur-2xl

                          border
                          border-amber-500/50

                          shadow-[0_15px_45px_rgba(0,0,0,0.5)]

                          p-2.5
                          sm:p-3.5

                          flex
                          items-center
                          justify-between

                          gap-2.5
                        "
                      >
                        {/* Dish information */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <span
                            className="
                              flex
                              items-center
                              gap-1

                              text-[8px]
                              sm:text-[9px]

                              uppercase

                              font-black

                              tracking-wider

                              text-amber-400
                            "
                          >
                            <ShoppingBag
                              className="
                                w-3
                                h-3
                              "
                            />

                            Dish in this reel
                          </span>

                          <h4
                            className="
                              mt-0.5

                              text-[10px]
                              sm:text-xs
                              lg:text-sm

                              font-bold

                              text-white

                              truncate
                            "
                          >
                            {reel.dishName}
                          </h4>

                          <span
                            className="
                              block
                              mt-0.5

                              text-[10px]
                              sm:text-xs

                              font-mono
                              font-black

                              text-white
                            "
                          >
                            ₹{reel.price}
                          </span>
                        </div>

                        {/* Order button */}

                        <button
                          onClick={() =>
                            handleOrderVideoDish(
                              reel
                            )
                          }
                          className="
                            shrink-0

                            px-3
                            sm:px-4

                            py-2
                            sm:py-2.5

                            rounded-xl

                            bg-amber-500
                            hover:bg-amber-400

                            text-stone-950

                            font-black

                            text-[9px]
                            sm:text-[10px]
                            lg:text-xs

                            flex
                            items-center
                            justify-center
                            gap-1.5

                            shadow-lg
                            shadow-amber-950/30

                            active:scale-95

                            transition

                            cursor-pointer
                          "
                        >
                          <ShoppingBag
                            className="
                              w-3
                              h-3
                              sm:w-3.5
                              sm:h-3.5
                            "
                          />

                          <span>
                            Order Now
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>
      </section>
    </main>
  );
};