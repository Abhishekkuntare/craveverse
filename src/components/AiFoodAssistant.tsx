import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useApp } from '../context/AppContext';

import {
  Bot,
  Sparkles,
  Send,
  X,
  ShoppingBag,
  ArrowRight,
  Heart,
  Flame,
  Clock,
  Wallet,
  Salad,
  PartyPopper,
  Film,
  Shuffle,
  ChevronRight,
  MessageCircle,
  RotateCcw,
  MapPin,
  Zap,
  Smile,
  Frown,
  Coffee,
  Soup,
  Search,
  Star,
  Plus,
  Check,
} from 'lucide-react';


/* ============================================================
   TYPES
============================================================ */

interface RecommendedDish {
  name: string;
  restaurantName: string;
  price: number;
  diet: 'veg' | 'non-veg';
  description: string;
  image: string;
  rating?: number;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  recommendedDishes?: RecommendedDish[];
}

interface QuickPrompt {
  icon: React.ReactNode;
  label: string;
  query: string;
  tone?: string;
}


/* ============================================================
   COMPONENT
============================================================ */

export const AiFoodAssistant: React.FC = () => {
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    aiInitialQuery,
    setAiInitialQuery,
    currentLocation,
    restaurantList,
    addToCart,
    showToast,
  } = useApp();


  /* ==========================================================
     STATE
  ========================================================== */

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hey food lover 👋

I'm BiteAI — your personal food concierge.

You don't need to know what you want.

Just tell me how you're feeling, how hungry you are, your budget, what you're craving, or even just say "I don't know what I want." 😌

I'll figure it out with you.`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);


  /* ==========================================================
     QUICK PROMPTS
  ========================================================== */

  const quickPrompts: QuickPrompt[] = [
    {
      icon: <Smile className="h-4 w-4" />,
      label: 'My mood',
      query:
        "I'm hungry. Ask me about my mood and then recommend what I should eat.",
      tone: 'amber',
    },

    {
      icon: <Heart className="h-4 w-4" />,
      label: 'Comfort food',
      query:
        "I'm looking for comforting food. Ask me a couple of questions and help me choose.",
      tone: 'rose',
    },

    {
      icon: <Flame className="h-4 w-4" />,
      label: 'Something spicy',
      query:
        "I'm craving something spicy. Help me choose something really satisfying.",
      tone: 'orange',
    },

    {
      icon: <Salad className="h-4 w-4" />,
      label: 'Eat healthy',
      query:
        "I want something healthy but still tasty. What should I eat?",
      tone: 'emerald',
    },

    {
      icon: <Wallet className="h-4 w-4" />,
      label: 'Budget meal',
      query:
        "I want a filling meal on a budget. Ask me for my budget if needed.",
      tone: 'yellow',
    },

    {
      icon: <Film className="h-4 w-4" />,
      label: 'Movie night',
      query:
        "I'm having a movie night. What food should I order?",
      tone: 'purple',
    },

    {
      icon: <Clock className="h-4 w-4" />,
      label: 'Quick food',
      query:
        "I'm really hungry and want something quick. What should I eat?",
      tone: 'cyan',
    },

    {
      icon: <Shuffle className="h-4 w-4" />,
      label: 'Surprise me',
      query:
        "Surprise me with something delicious. Ask me anything you need to make a good choice.",
      tone: 'pink',
    },
  ];


  /* ==========================================================
     SCROLL TO BOTTOM
  ========================================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);


  /* ==========================================================
     FOCUS INPUT WHEN OPEN
  ========================================================== */

  useEffect(() => {
    if (isAiAssistantOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isAiAssistantOpen]);


  /* ==========================================================
     INITIAL QUERY
  ========================================================== */

  useEffect(() => {
    if (
      aiInitialQuery &&
      isAiAssistantOpen
    ) {
      handleAsk(aiInitialQuery);
      setAiInitialQuery('');
    }
  }, [
    aiInitialQuery,
    isAiAssistantOpen,
  ]);


  /* ==========================================================
     BODY SCROLL LOCK ON MOBILE
  ========================================================== */

  useEffect(() => {
    if (!isAiAssistantOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isAiAssistantOpen]);


  /* ==========================================================
     SEND QUERY
  ========================================================== */

  const handleAsk = async (
    queryText: string
  ) => {
    const cleanQuery = queryText.trim();

    if (!cleanQuery || loading) {
      return;
    }

    setHasStarted(true);

    const userMessage: Message = {
      role: 'user',
      text: cleanQuery,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInputQuery('');
    setLoading(true);


    try {
      /* ======================================================
         BUILD RESTAURANT CONTEXT
      ====================================================== */

      const restSummary = restaurantList
        .slice(0, 8)
        .map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          cuisines: restaurant.cuisines,

          popularItems:
            restaurant.menuItems
              .slice(0, 5)
              .map((menuItem) => ({
                name: menuItem.name,
                price: menuItem.price,
                diet: menuItem.diet,
                description:
                  menuItem.description,
                image: menuItem.image,
              })),
        }));


      /* ======================================================
         SEND CONVERSATION CONTEXT
      ====================================================== */

      const conversationHistory =
        messages
          .slice(-8)
          .map((message) => ({
            role: message.role,
            text: message.text,
          }));


      const res = await fetch(
        '/api/ai/assistant',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            query: cleanQuery,

            location:
              currentLocation,

            restaurants:
              restSummary,

            conversation:
              conversationHistory,

            assistantMode:
              'food-concierge',

            instructions: `
You are BiteAI, a friendly personal food concierge.

The user can ask ANYTHING related to choosing food.

Do not require the user to know:
- cuisine
- dish name
- restaurant
- exact craving

Understand natural language such as:

"I'm hungry"
"I'm angry"
"I'm tired"
"I'm bored"
"My mood is bad"
"I want comfort food"
"I want something spicy"
"I want something light"
"I want something sweet"
"I have only ₹200"
"I don't know what I want"
"I'm ordering for two"
"I'm watching a movie"
"I need food quickly"

If important information is missing, ask ONE or TWO simple,
friendly follow-up questions rather than overwhelming the user.

Useful dimensions include:
- mood
- hunger level
- craving
- vegetarian/non-vegetarian preference
- budget
- quantity / number of people
- time available
- occasion
- spice preference

Do not interrogate the user.

Keep the conversation casual, warm and human.

When enough information is available:
1. Explain briefly why the recommendation fits.
2. Recommend the best available dishes from the provided restaurants.
3. Give alternatives when useful.
4. Mention price.
5. Never invent restaurant menu items that are not available
   in the provided restaurant context.
6. If there are no suitable dishes, clearly say so.

The user is looking for a decision helper, not a generic food article.

Example:

User:
"I'm angry and hungry."

Good response:
"Okay 😤 let's fix both problems with food.

Are you in the mood for something:
🌶️ spicy & intense
🍔 cheesy & indulgent
🍚 warm & comforting

If you don't care, I'll pick for you."

Another example:

User:
"I'm tired."

Good response:
"Then let's not make this difficult 😌

I'd go for something warm, comforting and filling.
Do you want:
🍜 something cozy
🍕 something indulgent
🥗 something light?"

Be conversational and concise.
`,
          }),
        }
      );


      /* ======================================================
         PARSE RESPONSE
      ====================================================== */

      const data = await res.json();


      if (
        data &&
        typeof data.text === 'string'
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.text,
            recommendedDishes:
              Array.isArray(
                data.recommendedDishes
              )
                ? data.recommendedDishes
                : undefined,
          },
        ]);
      } else {
        throw new Error(
          'Invalid AI response'
        );
      }

    } catch (error) {
      console.error(
        'BiteAI error:',
        error
      );

      /* ======================================================
         LOCAL FALLBACK
      ====================================================== */

      const fallbackText =
        buildLocalFallback(
          cleanQuery,
          restaurantList
        );

      const fallbackDishes =
        getFallbackDishes(
          cleanQuery,
          restaurantList
        );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fallbackText,
          recommendedDishes:
            fallbackDishes,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  /* ==========================================================
     ORDER RECOMMENDATION
  ========================================================== */

  const handleOrderRecommendation = (
    dishRec: RecommendedDish
  ) => {
    let matchedItem: any = null;

    for (const restaurant of restaurantList) {
      const found =
        restaurant.menuItems.find(
          (menuItem) =>
            menuItem.name
              .toLowerCase()
              .trim() ===
            dishRec.name
              .toLowerCase()
              .trim()
        );

      if (found) {
        matchedItem = found;
        break;
      }
    }


    if (matchedItem) {
      addToCart(matchedItem);
    } else if (
      restaurantList.length > 0
    ) {
      addToCart({
        id:
          'ai-dish-' +
          Date.now(),

        restaurantId:
          restaurantList[0].id,

        name:
          dishRec.name,

        description:
          dishRec.description,

        price:
          dishRec.price,

        diet:
          dishRec.diet,

        category:
          'Chef Special',

        image:
          dishRec.image ||
          restaurantList[0].coverImage,

        rating:
          dishRec.rating || 4.8,

        ratingCount: 94,

        isAvailable: true,
      });
    } else {
      showToast(
        'No restaurant menu is available right now.',
        'error'
      );

      return;
    }


    showToast(
      `Added ${dishRec.name} to cart!`,
      'success'
    );
  };


  /* ==========================================================
     RESET CHAT
  ========================================================== */

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Fresh start 🍽️

Tell me anything.

Your mood.
Your hunger.
Your budget.
A craving.
A random thought.

Or just say "I'm hungry" and I'll take it from there.`,
      },
    ]);

    setInputQuery('');
    setHasStarted(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };


  /* ==========================================================
     CLOSE
  ========================================================== */

  const closeAssistant = () => {
    setIsAiAssistantOpen(false);
  };


  /* ==========================================================
     ENTER KEY
  ========================================================== */

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleAsk(inputQuery);
    }
  };


  /* ==========================================================
     NOT OPEN
  ========================================================== */

  if (!isAiAssistantOpen) {
    return null;
  }


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-stretch justify-end
        bg-black/70
        backdrop-blur-md
      "
      onClick={closeAssistant}
    >

      {/* ======================================================
          DRAWER
      ======================================================= */}

      <div
        className="
          relative
          flex h-full
          w-full
          flex-col
          overflow-hidden
          bg-stone-950
          text-white
          shadow-2xl
          shadow-black/60
          sm:max-w-[480px]
          lg:max-w-[520px]
          xl:max-w-[560px]
          sm:border-l
          sm:border-stone-800
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ====================================================
            TOP GLOW
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[-180px]
            h-[350px]
            w-[350px]
            -translate-x-1/2
            rounded-full
            bg-purple-500/10
            blur-[100px]
          "
        />


        {/* ====================================================
            HEADER
        ===================================================== */}

        <header
          className="
            relative
            z-10
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-stone-800
            bg-stone-950/90
            px-4
            py-3.5
            backdrop-blur-xl
            sm:px-5
          "
        >

          {/* BRAND */}
          <div className="flex min-w-0 items-center gap-3">

            <div
              className="
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                bg-gradient-to-br
                from-purple-500
                via-fuchsia-500
                to-amber-500
                shadow-lg
                shadow-purple-500/20
              "
            >
              <Bot className="h-5 w-5 text-white" />

              <span
                className="
                  absolute
                  bottom-1
                  right-1
                  h-2
                  w-2
                  rounded-full
                  border-2
                  border-purple-500
                  bg-emerald-400
                "
              />
            </div>


            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h2
                  className="
                    truncate
                    text-sm
                    font-black
                    tracking-tight
                    text-white
                    sm:text-base
                  "
                >
                  BiteAI
                </h2>

                <span
                  className="
                    hidden
                    rounded-full
                    border
                    border-purple-500/30
                    bg-purple-500/10
                    px-2
                    py-0.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-purple-300
                    sm:inline-flex
                  "
                >
                  Concierge
                </span>
              </div>


              <div
                className="
                  mt-0.5
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  text-stone-500
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="truncate">
                  Personal food concierge
                </span>

                <span className="hidden text-stone-700 sm:inline">
                  •
                </span>

                <MapPin className="hidden h-3 w-3 sm:block" />

                <span className="hidden sm:inline">
                  {currentLocation.city}
                </span>
              </div>
            </div>
          </div>


          {/* HEADER ACTIONS */}
          <div className="flex shrink-0 items-center gap-1">

            <button
              type="button"
              onClick={resetChat}
              title="New conversation"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-stone-500
                transition
                hover:bg-stone-800
                hover:text-white
              "
            >
              <RotateCcw className="h-4 w-4" />
            </button>


            <button
              type="button"
              onClick={closeAssistant}
              aria-label="Close BiteAI"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-stone-400
                transition
                hover:bg-stone-800
                hover:text-white
              "
            >
              <X className="h-5 w-5" />
            </button>

          </div>
        </header>


        {/* ====================================================
            CHAT CONTENT
        ===================================================== */}

        <main
          className="
            relative
            flex-1
            overflow-y-auto
            overscroll-contain
            px-3
            py-4
            sm:px-5
            sm:py-5
          "
        >

          {/* ==================================================
              WELCOME DISCOVERY PANEL
          =================================================== */}

          {!hasStarted &&
            messages.length === 1 && (
              <div className="mb-5">

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-stone-800
                    bg-gradient-to-br
                    from-stone-900
                    via-stone-900
                    to-purple-950/20
                    p-5
                    shadow-xl
                  "
                >

                  {/* Decorative icon */}
                  <div
                    className="
                      absolute
                      right-[-20px]
                      top-[-20px]
                      opacity-[0.06]
                    "
                  >
                    <Sparkles className="h-36 w-36" />
                  </div>


                  <div
                    className="
                      relative
                      mb-4
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-purple-500/20
                      to-amber-500/20
                      text-purple-300
                    "
                  >
                    <Sparkles className="h-6 w-6" />
                  </div>


                  <p
                    className="
                      mb-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-purple-400
                    "
                  >
                    Don't know what to eat?
                  </p>


                  <h3
                    className="
                      max-w-[380px]
                      text-xl
                      font-black
                      leading-tight
                      tracking-tight
                      text-white
                      sm:text-2xl
                    "
                  >
                    Tell me how you're feeling.
                    <span className="text-stone-500">
                      {' '}
                      I'll handle the food part.
                    </span>
                  </h3>


                  <p
                    className="
                      mt-3
                      max-w-[420px]
                      text-xs
                      leading-relaxed
                      text-stone-400
                      sm:text-sm
                    "
                  >
                    Mood, hunger, budget, craving,
                    occasion — anything works.
                    You can even just say
                    <span className="text-stone-200">
                      {' '}
                      "I'm hungry."
                    </span>
                  </p>


                  {/* Location */}
                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      text-stone-500
                    "
                  >
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />

                    <span>
                      Finding options around{' '}
                      <strong className="text-stone-300">
                        {currentLocation.area}
                      </strong>
                    </span>
                  </div>
                </div>


                {/* =================================================
                    ASK ME CARDS
                ================================================== */}

                <div className="mt-5">

                  <div className="mb-3 flex items-center justify-between">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                        Try asking
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-stone-400">
                        Or write anything below
                      </p>
                    </div>

                    <MessageCircle className="h-4 w-4 text-stone-700" />
                  </div>


                  <div className="grid grid-cols-2 gap-2">

                    {quickPrompts.map(
                      (prompt) => (
                        <button
                          key={prompt.label}
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            handleAsk(
                              prompt.query
                            )
                          }
                          className="
                            group
                            flex
                            min-h-[68px]
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-stone-800
                            bg-stone-900/70
                            p-3
                            text-left
                            transition
                            hover:border-stone-700
                            hover:bg-stone-800
                            active:scale-[0.98]
                          "
                        >

                          <span
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-stone-800
                              text-stone-300
                              transition
                              group-hover:bg-stone-700
                              group-hover:text-white
                            "
                          >
                            {prompt.icon}
                          </span>


                          <span className="min-w-0 flex-1">

                            <span
                              className="
                                block
                                truncate
                                text-[11px]
                                font-bold
                                text-stone-200
                              "
                            >
                              {prompt.label}
                            </span>

                            <span
                              className="
                                mt-0.5
                                block
                                text-[9px]
                                text-stone-600
                              "
                            >
                              Ask BiteAI
                            </span>
                          </span>


                          <ChevronRight
                            className="
                              h-3.5
                              w-3.5
                              shrink-0
                              text-stone-700
                              transition
                              group-hover:translate-x-0.5
                              group-hover:text-stone-400
                            "
                          />
                        </button>
                      )
                    )}

                  </div>
                </div>

              </div>
            )}


          {/* ==================================================
              MESSAGES
          =================================================== */}

          <div className="space-y-5">

            {messages.map(
              (message, index) => {

                const isUser =
                  message.role === 'user';

                return (
                  <div
                    key={index}
                    className={`flex ${
                      isUser
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >

                    <div
                      className={`flex max-w-[92%] gap-2.5 sm:max-w-[88%] ${
                        isUser
                          ? 'flex-row-reverse'
                          : 'flex-row'
                      }`}
                    >

                      {/* AI ICON */}
                      {!isUser && (
                        <div
                          className="
                            mt-1
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-purple-500/20
                            to-amber-500/20
                            text-purple-300
                          "
                        >
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}


                      {/* MESSAGE */}
                      <div className="min-w-0">

                        <div
                          className={`rounded-2xl px-4 py-3.5 text-xs leading-relaxed sm:text-sm ${
                            isUser
                              ? 'rounded-tr-md bg-amber-500 font-medium text-stone-950 shadow-lg shadow-amber-500/10'
                              : 'rounded-tl-md border border-stone-800 bg-stone-900 text-stone-200 shadow-lg shadow-black/10'
                          }`}
                        >
                          {message.text}
                        </div>


                        {/* =================================================
                            DISH RECOMMENDATIONS
                        ================================================== */}

                        {message.recommendedDishes &&
                          message.recommendedDishes
                            .length > 0 && (

                            <div className="mt-3 space-y-2">

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  px-1
                                "
                              >
                                <Sparkles className="h-3 w-3 text-amber-400" />

                                <span
                                  className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-amber-400
                                  "
                                >
                                  BiteAI picks
                                </span>
                              </div>


                              {message.recommendedDishes.map(
                                (
                                  dish,
                                  dishIndex
                                ) => (
                                  <div
                                    key={`${dish.name}-${dishIndex}`}
                                    className="
                                      group
                                      overflow-hidden
                                      rounded-2xl
                                      border
                                      border-stone-800
                                      bg-stone-900
                                      shadow-lg
                                    "
                                  >

                                    <div className="flex gap-3 p-2.5">

                                      {/* IMAGE */}
                                      <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-stone-800">

                                        <img
                                          src={
                                            dish.image
                                          }
                                          alt={
                                            dish.name
                                          }
                                          loading="lazy"
                                          referrerPolicy="no-referrer"
                                          className="
                                            h-full
                                            w-full
                                            object-cover
                                            transition
                                            duration-500
                                            group-hover:scale-105
                                          "
                                        />

                                        <div
                                          className="
                                            absolute
                                            left-1.5
                                            top-1.5
                                            rounded-md
                                            bg-black/70
                                            px-1.5
                                            py-0.5
                                            text-[8px]
                                            font-bold
                                            text-white
                                            backdrop-blur-md
                                          "
                                        >
                                          {dish.diet ===
                                          'veg'
                                            ? 'VEG'
                                            : 'NON-VEG'}
                                        </div>
                                      </div>


                                      {/* INFO */}
                                      <div className="min-w-0 flex-1">

                                        <div className="flex items-start justify-between gap-2">

                                          <div className="min-w-0">

                                            <h4
                                              className="
                                                truncate
                                                text-xs
                                                font-bold
                                                text-white
                                              "
                                            >
                                              {
                                                dish.name
                                              }
                                            </h4>

                                            <p
                                              className="
                                                mt-0.5
                                                truncate
                                                text-[9px]
                                                text-stone-500
                                              "
                                            >
                                              {
                                                dish.restaurantName
                                              }
                                            </p>
                                          </div>

                                          <span
                                            className="
                                              shrink-0
                                              font-mono
                                              text-xs
                                              font-black
                                              text-amber-400
                                            "
                                          >
                                            ₹
                                            {
                                              dish.price
                                            }
                                          </span>
                                        </div>


                                        <p
                                          className="
                                            mt-1.5
                                            line-clamp-2
                                            text-[9px]
                                            leading-relaxed
                                            text-stone-500
                                          "
                                        >
                                          {
                                            dish.description
                                          }
                                        </p>


                                        <div className="mt-2 flex items-center justify-between">

                                          {dish.rating && (
                                            <div
                                              className="
                                                flex
                                                items-center
                                                gap-1
                                                text-[9px]
                                                text-stone-500
                                              "
                                            >
                                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />

                                              <span>
                                                {
                                                  dish.rating
                                                }
                                              </span>
                                            </div>
                                          )}


                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleOrderRecommendation(
                                                dish
                                              )
                                            }
                                            className="
                                              ml-auto
                                              flex
                                              items-center
                                              gap-1
                                              rounded-lg
                                              bg-amber-500
                                              px-2.5
                                              py-1.5
                                              text-[9px]
                                              font-black
                                              text-stone-950
                                              transition
                                              hover:bg-amber-400
                                              active:scale-95
                                            "
                                          >
                                            <Plus className="h-3 w-3" />

                                            Add
                                          </button>

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                      </div>
                    </div>
                  </div>
                );
              }
            )}


            {/* ==================================================
                LOADING
            =================================================== */}

            {loading && (
              <div className="flex items-start gap-2.5">

                <div
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-500/10
                    text-purple-300
                  "
                >
                  <Bot className="h-3.5 w-3.5" />
                </div>


                <div
                  className="
                    rounded-2xl
                    rounded-tl-md
                    border
                    border-stone-800
                    bg-stone-900
                    px-4
                    py-3
                  "
                >

                  <div className="flex items-center gap-1.5">

                    <span
                      className="
                        h-1.5
                        w-1.5
                        animate-bounce
                        rounded-full
                        bg-purple-400
                      "
                    />

                    <span
                      className="
                        h-1.5
                        w-1.5
                        animate-bounce
                        rounded-full
                        bg-purple-400
                        [animation-delay:120ms]
                      "
                    />

                    <span
                      className="
                        h-1.5
                        w-1.5
                        animate-bounce
                        rounded-full
                        bg-purple-400
                        [animation-delay:240ms]
                      "
                    />

                    <span className="ml-2 text-[9px] text-stone-500">
                      Thinking about your craving...
                    </span>
                  </div>

                </div>
              </div>
            )}

          </div>


          <div
            ref={messagesEndRef}
            className="h-1"
          />

        </main>


        {/* ====================================================
            QUICK CHIPS AFTER CHAT STARTS
        ===================================================== */}

        {hasStarted && (
          <div
            className="
              shrink-0
              border-t
              border-stone-800/70
              bg-stone-950/95
              px-3
              py-2
              sm:px-5
            "
          >

            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-0.5
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >

              {[
                {
                  icon: <Flame className="h-3 w-3" />,
                  text: 'Make it spicy',
                  query:
                    'Make the recommendation more spicy.',
                },

                {
                  icon: <Wallet className="h-3 w-3" />,
                  text: 'Under ₹200',
                  query:
                    'Keep it under ₹200.',
                },

                {
                  icon: <Salad className="h-3 w-3" />,
                  text: 'Make it healthy',
                  query:
                    'Give me a healthier option.',
                },

                {
                  icon: <Shuffle className="h-3 w-3" />,
                  text: 'Surprise me',
                  query:
                    'Surprise me with another option.',
                },

                {
                  icon: <Heart className="h-3 w-3" />,
                  text: 'Comfort food',
                  query:
                    'Give me something comforting.',
                },
              ].map((chip) => (
                <button
                  key={chip.text}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleAsk(chip.query)
                  }
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-stone-800
                    bg-stone-900
                    px-3
                    py-1.5
                    text-[9px]
                    font-semibold
                    text-stone-400
                    transition
                    hover:border-stone-700
                    hover:bg-stone-800
                    hover:text-stone-200
                  "
                >
                  {chip.icon}

                  {chip.text}
                </button>
              ))}

            </div>
          </div>
        )}


        {/* ====================================================
            INPUT
        ===================================================== */}

        <footer
          className="
            shrink-0
            border-t
            border-stone-800
            bg-stone-950
            px-3
            pb-[max(10px,env(safe-area-inset-bottom))]
            pt-3
            sm:px-5
            sm:pb-4
          "
        >

          <div
            className="
              flex
              items-end
              gap-2
              rounded-2xl
              border
              border-stone-700
              bg-stone-900
              p-1.5
              shadow-inner
              transition
              focus-within:border-purple-500/50
              focus-within:ring-2
              focus-within:ring-purple-500/10
            "
          >

            <div className="flex min-w-0 flex-1 items-center">

              <Search className="ml-2 h-4 w-4 shrink-0 text-stone-600" />

              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) =>
                  setInputQuery(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleInputKeyDown
                }
                disabled={loading}
                placeholder={
                  hasStarted
                    ? 'Tell me more...'
                    : 'I’m hungry... what should I eat?'
                }
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2.5
                  py-2.5
                  text-xs
                  text-white
                  placeholder:text-stone-600
                  focus:outline-none
                  sm:text-sm
                "
              />
            </div>


            <button
              type="button"
              disabled={
                !inputQuery.trim() ||
                loading
              }
              onClick={() =>
                handleAsk(inputQuery)
              }
              aria-label="Send message"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-amber-500
                text-stone-950
                shadow-lg
                shadow-amber-500/10
                transition
                hover:bg-amber-400
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              {loading ? (
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-stone-950/30
                    border-t-stone-950
                  "
                />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>

          </div>


          {/* FOOTER HINT */}
          <div
            className="
              mt-2
              flex
              items-center
              justify-between
              px-1
              text-[8px]
              text-stone-700
            "
          >
            <span>
              BiteAI can help with cravings,
              moods, budgets & more
            </span>

            <span className="hidden sm:inline">
              Press Enter to send
            </span>
          </div>

        </footer>

      </div>
    </div>
  );
};


/* ============================================================
   LOCAL FALLBACK
   Used if /api/ai/assistant is unavailable.
============================================================ */

function buildLocalFallback(
  query: string,
  restaurantList: any[]
): string {
  const text =
    query.toLowerCase();

  if (
    text.includes('angry') ||
    text.includes('mad') ||
    text.includes('frustrated')
  ) {
    return `Okay 😤 let's fix both problems with food.

Since you're hungry and annoyed, I'd avoid making this complicated.

Do you want:

🌶️ something spicy & intense
🍔 something indulgent
🍚 something warm & comforting

Or tell me your budget and I'll pick for you.`;
  }


  if (
    text.includes('tired') ||
    text.includes('exhausted')
  ) {
    return `You're tired, so let's make the decision easy 😌

I'd go for something warm, comforting and filling.

Want:
🍜 something cozy
🍕 something indulgent
🥗 something light

Or just say "surprise me."`;
  }


  if (
    text.includes('sad') ||
    text.includes('low') ||
    text.includes('bad mood')
  ) {
    return `Bad mood detected 💛

Let's get you something comforting.

I'm leaning toward warm, flavorful food rather than something boring.

Tell me:
🌶️ spicy
🧀 cheesy
🍜 cozy
🍰 sweet

and I'll narrow it down.`;
  }


  if (
    text.includes('healthy') ||
    text.includes('health')
  ) {
    return `Let's keep it healthy without making dinner feel like punishment 🥗

I'd look for something:
• filling
• protein-friendly
• not too heavy

Tell me your budget or veg/non-veg preference and I'll narrow it down.`;
  }


  if (
    text.includes('sweet') ||
    text.includes('dessert')
  ) {
    return `Sweet tooth activated 🍰

I can help you choose between:
🍫 rich & chocolatey
🍦 cold & creamy
🍮 soft & comforting
🍓 fruity & light

Tell me your mood or budget and I'll pick one.`;
  }


  if (
    text.includes('hungry') ||
    text.includes('eat')
  ) {
    return `You're hungry — good enough reason to start 😋

Let's make this easy.

What sounds closest right now?

🌶️ Spicy
🍔 Indulgent
🍚 Comforting
🥗 Healthy
🍰 Sweet

Or just give me your budget and I'll do the thinking.`;
  }


  if (
    text.includes('surprise')
  ) {
    return `Okay, I'm choosing for you 🎲

I'm going to balance something tasty, satisfying and worth the money.

If you want me to make the choice even better, tell me:
• veg or non-veg
• your budget
• how hungry you are

Otherwise, trust me 😌`;
  }


  if (
    restaurantList.length > 0
  ) {
    return `I can help you figure this out 😋

You don't need to know the exact dish.

Tell me something simple like:

"I'm hungry and want something spicy."

or

"I'm tired and want comfort food under ₹250."

or

"My mood is good, surprise me."

I'll take it from there.`;
  }


  return `Tell me anything about what you're looking for 🍽️

Your mood, hunger, budget, craving, diet or occasion — even if you don't know exactly what you want.

I'll help you decide.`;
}


/* ============================================================
   FALLBACK DISHES
============================================================ */

function getFallbackDishes(
  query: string,
  restaurantList: any[]
): RecommendedDish[] {
  if (
    restaurantList.length === 0
  ) {
    return [];
  }


  const queryLower =
    query.toLowerCase();


  const dishes: RecommendedDish[] =
    [];


  for (
    const restaurant of restaurantList
  ) {
    for (
      const item of restaurant.menuItems
    ) {
      const itemText =
        `${item.name} ${item.description} ${item.category || ''}`
          .toLowerCase();

      let score = 0;


      /* Spicy */
      if (
        queryLower.includes('spicy') &&
        (
          itemText.includes('spicy') ||
          itemText.includes('chilli') ||
          itemText.includes('chili') ||
          itemText.includes('peri')
        )
      ) {
        score += 5;
      }


      /* Healthy */
      if (
        (
          queryLower.includes('healthy') ||
          queryLower.includes('light')
        ) &&
        (
          itemText.includes('salad') ||
          itemText.includes('grill') ||
          itemText.includes('healthy') ||
          itemText.includes('protein')
        )
      ) {
        score += 5;
      }


      /* Sweet */
      if (
        (
          queryLower.includes('sweet') ||
          queryLower.includes('dessert')
        ) &&
        (
          itemText.includes('cake') ||
          itemText.includes('ice cream') ||
          itemText.includes('dessert') ||
          itemText.includes('brownie') ||
          itemText.includes('sweet')
        )
      ) {
        score += 5;
      }


      /* Budget */
      if (
        queryLower.includes('200') &&
        item.price <= 200
      ) {
        score += 4;
      }


      if (
        queryLower.includes('250') &&
        item.price <= 250
      ) {
        score += 4;
      }


      if (
        queryLower.includes('300') &&
        item.price <= 300
      ) {
        score += 4;
      }


      /* General food */
      if (score === 0) {
        score = 1;
      }


      dishes.push({
        name: item.name,
        restaurantName:
          restaurant.name,
        price: item.price,
        diet:
          item.diet as
            | 'veg'
            | 'non-veg',
        description:
          item.description,
        image: item.image,
        rating:
          item.rating || 4.5,
      });
    }
  }


  /*
    Sort matching dishes first.
    Since the source item does not always
    expose a score field, rebuild using
    the query matcher above.
  */

  const scored = dishes.map(
    (dish) => {
      let score = 0;

      const dishText =
        `${dish.name} ${dish.description}`
          .toLowerCase();

      if (
        queryLower.includes('spicy') &&
        dishText.includes('spicy')
      ) {
        score += 5;
      }

      if (
        queryLower.includes('healthy') &&
        (
          dishText.includes('healthy') ||
          dishText.includes('salad') ||
          dishText.includes('grill')
        )
      ) {
        score += 5;
      }

      if (
        queryLower.includes('sweet') &&
        (
          dishText.includes('sweet') ||
          dishText.includes('cake') ||
          dishText.includes('dessert') ||
          dishText.includes('brownie')
        )
      ) {
        score += 5;
      }

      if (
        queryLower.includes('200') &&
        dish.price <= 200
      ) {
        score += 4;
      }

      if (
        queryLower.includes('250') &&
        dish.price <= 250
      ) {
        score += 4;
      }

      if (
        queryLower.includes('300') &&
        dish.price <= 300
      ) {
        score += 4;
      }

      return {
        dish,
        score,
      };
    }
  );


  return scored
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 3)
    .map(
      (item) => item.dish
    );
}