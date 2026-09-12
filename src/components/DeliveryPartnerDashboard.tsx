import React, { useState } from 'react';

import { useApp } from '../context/AppContext';

import {
  Bike,
  MapPin,
  BatteryCharging,
  DollarSign,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Clock,
  Navigation,
  Sparkles,
  ChevronRight,
  PackageCheck,
  Route,
  WalletCards,
  CircleDot,
  Zap,
} from 'lucide-react';

export const DeliveryPartnerDashboard: React.FC = () => {
  const { showToast } = useApp();

  const [isOnline, setIsOnline] = useState(true);

  const [taskStep, setTaskStep] = useState<
    'PICKUP' | 'EN_ROUTE' | 'COMPLETED'
  >('PICKUP');

  const handleAdvanceTask = () => {
    if (taskStep === 'PICKUP') {
      setTaskStep('EN_ROUTE');

      showToast(
        'Order marked as Picked Up! Turn-by-turn navigation started.',
        'success'
      );
    } else if (taskStep === 'EN_ROUTE') {
      setTaskStep('COMPLETED');

      showToast(
        'Delivery completed! ₹68 credited to your rider wallet.',
        'success'
      );
    } else {
      setTaskStep('PICKUP');

      showToast(
        'Ready for next delivery assignment!',
        'info'
      );
    }
  };

  const handleOnlineToggle = () => {
    const nextState = !isOnline;

    setIsOnline(nextState);

    showToast(
      nextState
        ? 'You are now Online! Receiving orders.'
        : 'Duty set to Offline',
      'info'
    );
  };

  const getTaskTitle = () => {
    switch (taskStep) {
      case 'PICKUP':
        return 'Confirm Pickup at Kitchen';

      case 'EN_ROUTE':
        return 'Confirm Handover at Doorstep';

      case 'COMPLETED':
        return 'Assignment Done • Next Order';

      default:
        return 'Confirm Pickup at Kitchen';
    }
  };

  const getTaskDescription = () => {
    switch (taskStep) {
      case 'PICKUP':
        return 'Food inspected and ready';

      case 'EN_ROUTE':
        return 'Customer is waiting';

      case 'COMPLETED':
        return '₹68 credited to rider wallet';

      default:
        return 'Food inspected and ready';
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-950 text-stone-100">
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-3
          py-4
          sm:px-5
          sm:py-6
          lg:px-8
          lg:py-8
        "
      >
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">

          {/* =====================================================
              RIDER PROFILE HEADER
          ====================================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-stone-800
              bg-stone-900
              shadow-xl
              shadow-black/10
              sm:rounded-3xl
            "
          >
            <div className="p-4 sm:p-6">

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                {/* Rider */}
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                  <div className="relative shrink-0">

                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                      alt="Vikram Rajput"
                      referrerPolicy="no-referrer"
                      className="
                        h-14
                        w-14
                        rounded-2xl
                        border-2
                        border-emerald-500
                        object-cover
                        shadow-lg
                        shadow-emerald-500/10
                        sm:h-16
                        sm:w-16
                      "
                    />

                    <span
                      className={`
                        absolute
                        -bottom-1
                        -right-1
                        h-4
                        w-4
                        rounded-full
                        border-2
                        border-stone-900
                        ${
                          isOnline
                            ? 'bg-emerald-500'
                            : 'bg-stone-500'
                        }
                      `}
                    />
                  </div>


                  <div className="min-w-0">

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <h1
                        className="
                          truncate
                          font-display
                          text-lg
                          font-extrabold
                          tracking-tight
                          text-white
                          sm:text-2xl
                        "
                      >
                        Vikram Rajput
                      </h1>

                      <span
                        className="
                          inline-flex
                          items-center
                          rounded-full
                          bg-amber-500/15
                          px-2
                          py-1
                          text-[9px]
                          font-bold
                          text-amber-300
                          sm:text-[10px]
                        "
                      >
                        ★ 4.9
                        <span className="ml-1 hidden sm:inline">
                          (1,840 Trips)
                        </span>
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        max-w-full
                        truncate
                        text-[10px]
                        text-stone-400
                        sm:text-xs
                      "
                    >
                      Ather 450X Electric Scooter
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        font-mono
                        text-stone-600
                        sm:text-[10px]
                      "
                    >
                      KA-03-HA-4819
                    </p>
                  </div>
                </div>


                {/* =================================================
                    STATUS CONTROLS
                ================================================== */}

                <div
                  className="
                    grid
                    w-full
                    grid-cols-1
                    gap-2
                    sm:grid-cols-2
                    lg:w-auto
                    lg:min-w-[350px]
                  "
                >

                  {/* Battery */}
                  <div
                    className="
                      flex
                      min-h-[46px]
                      items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border
                      border-stone-800
                      bg-stone-950
                      px-3
                      py-2.5
                    "
                  >
                    <div className="flex min-w-0 items-center gap-2">

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-emerald-500/10
                        "
                      >
                        <BatteryCharging
                          className="
                            h-4
                            w-4
                            text-emerald-400
                          "
                        />
                      </div>

                      <div className="min-w-0">

                        <p
                          className="
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-stone-600
                          "
                        >
                          EV Battery
                        </p>

                        <p
                          className="
                            truncate
                            text-[11px]
                            font-bold
                            text-emerald-400
                          "
                        >
                          86% • 68 km
                        </p>
                      </div>
                    </div>

                    <Zap
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-emerald-500/60
                      "
                    />
                  </div>


                  {/* Online */}
                  <button
                    type="button"
                    onClick={handleOnlineToggle}
                    className={`
                      min-h-[46px]
                      rounded-xl
                      px-4
                      py-2.5
                      text-[10px]
                      font-black
                      tracking-wide
                      transition
                      active:scale-[0.98]
                      ${
                        isOnline
                          ? `
                            bg-emerald-500
                            text-stone-950
                            shadow-lg
                            shadow-emerald-500/10
                            hover:bg-emerald-400
                          `
                          : `
                            border
                            border-stone-700
                            bg-stone-800
                            text-stone-300
                            hover:bg-stone-700
                          `
                      }
                    `}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span
                        className={`
                          h-2
                          w-2
                          rounded-full
                          ${
                            isOnline
                              ? 'bg-stone-950'
                              : 'bg-stone-500'
                          }
                        `}
                      />

                      {isOnline
                        ? 'ONLINE • ON DUTY'
                        : 'GO ONLINE'}
                    </span>
                  </button>

                </div>
              </div>
            </div>
          </section>


          {/* =====================================================
              METRICS
          ====================================================== */}

          <section
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:grid-cols-2
              sm:gap-4
              lg:grid-cols-4
            "
          >

            {/* Earnings */}
            <MetricCard
              icon={<DollarSign className="h-4 w-4" />}
              label="Today's Earnings"
              value="₹1,480"
              sub="+₹240 customer tips"
              subPositive
            />

            {/* Trips */}
            <MetricCard
              icon={<Bike className="h-4 w-4" />}
              label="Completed Trips"
              value="14"
              valueSuffix=" Deliveries"
              sub="Target: 16 • +₹150 bonus"
              accent
            />

            {/* Weekly */}
            <MetricCard
              icon={<WalletCards className="h-4 w-4" />}
              label="Weekly Payout"
              value="₹8,920"
              sub="Transfers every Tuesday"
            />

            {/* Score */}
            <MetricCard
              icon={<ShieldCheck className="h-4 w-4" />}
              label="On-Time Score"
              value="99.4%"
              sub="Tier 1 Platinum Partner"
              subPositive
            />

          </section>


          {/* =====================================================
              ACTIVE DELIVERY
          ====================================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-stone-800
              bg-stone-900
              shadow-xl
              shadow-black/10
              sm:rounded-3xl
            "
          >

            {/* =================================================
                ASSIGNMENT HEADER
            ================================================== */}

            <div
              className="
                border-b
                border-stone-800
                p-4
                sm:p-6
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div className="flex min-w-0 items-center gap-2.5">

                  <span className="relative flex h-3 w-3 shrink-0">

                    {taskStep !== 'COMPLETED' && (
                      <span
                        className="
                          absolute
                          inline-flex
                          h-full
                          w-full
                          animate-ping
                          rounded-full
                          bg-amber-400
                          opacity-60
                        "
                      />
                    )}

                    <span
                      className={`
                        relative
                        inline-flex
                        h-3
                        w-3
                        rounded-full
                        ${
                          taskStep === 'COMPLETED'
                            ? 'bg-emerald-500'
                            : 'bg-amber-400'
                        }
                      `}
                    />
                  </span>


                  <div className="min-w-0">

                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-stone-600
                        sm:text-[9px]
                      "
                    >
                      Active Assignment
                    </p>

                    <h2
                      className="
                        truncate
                        font-display
                        text-base
                        font-extrabold
                        text-white
                        sm:text-lg
                      "
                    >
                      #CRV-89421
                    </h2>
                  </div>
                </div>


                {/* Payment */}
                <div
                  className="
                    inline-flex
                    w-fit
                    items-center
                    gap-1.5
                    rounded-xl
                    bg-amber-500/10
                    px-3
                    py-2
                    text-[10px]
                    font-bold
                    text-amber-300
                    sm:text-xs
                  "
                >
                  <WalletCards className="h-3.5 w-3.5" />

                  <span>
                    ₹68.00
                    <span className="mx-1 text-stone-700">
                      +
                    </span>
                    ₹30 Tip
                  </span>
                </div>
              </div>


              {/* =================================================
                  TASK PROGRESS
              ================================================== */}

              <div className="mt-5">

                <div className="flex items-center">

                  <TaskProgress
                    active={
                      taskStep === 'PICKUP'
                    }
                    completed={
                      taskStep === 'EN_ROUTE' ||
                      taskStep === 'COMPLETED'
                    }
                    icon={
                      <PackageCheck className="h-3.5 w-3.5" />
                    }
                    label="Pickup"
                  />

                  <div
                    className={`
                      h-px
                      flex-1
                      ${
                        taskStep === 'EN_ROUTE' ||
                        taskStep === 'COMPLETED'
                          ? 'bg-amber-500'
                          : 'bg-stone-800'
                      }
                    `}
                  />

                  <TaskProgress
                    active={
                      taskStep === 'EN_ROUTE'
                    }
                    completed={
                      taskStep === 'COMPLETED'
                    }
                    icon={
                      <Route className="h-3.5 w-3.5" />
                    }
                    label="En Route"
                  />

                  <div
                    className={`
                      h-px
                      flex-1
                      ${
                        taskStep === 'COMPLETED'
                          ? 'bg-emerald-500'
                          : 'bg-stone-800'
                      }
                    `}
                  />

                  <TaskProgress
                    active={
                      taskStep === 'COMPLETED'
                    }
                    completed={
                      taskStep === 'COMPLETED'
                    }
                    icon={
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    }
                    label="Delivered"
                  />

                </div>
              </div>
            </div>


            {/* =================================================
                PICKUP / DROP
            ================================================== */}

            <div className="p-4 sm:p-6">

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  md:grid-cols-2
                "
              >

                {/* Pickup */}
                <LocationCard
                  type="Pickup From"
                  status="Ready in 2 min"
                  statusTone="green"
                  title="Burger Lab & Smokehouse"
                  address="12th Main Rd, Indiranagar"
                  distance="0.6 km away"
                  icon={
                    <PackageCheck className="h-4 w-4" />
                  }
                />


                {/* Delivery */}
                <LocationCard
                  type="Deliver To"
                  status={
                    taskStep === 'COMPLETED'
                      ? 'Delivered'
                      : 'Customer Waiting'
                  }
                  statusTone={
                    taskStep === 'COMPLETED'
                      ? 'green'
                      : 'amber'
                  }
                  title="Skyline Palms, Flat 402"
                  address="100ft Road, Indiranagar"
                  distance="2.4 km trip"
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                />

              </div>


              {/* =================================================
                  ROUTE SUMMARY
              ================================================== */}

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  rounded-xl
                  border
                  border-stone-800
                  bg-stone-950
                  px-3
                  py-2.5
                  text-[9px]
                  text-stone-500
                "
              >

                <span className="flex items-center gap-1.5">
                  <Navigation className="h-3 w-3 text-emerald-400" />
                  3.0 km total route
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-stone-700 sm:block" />

                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-amber-400" />
                  ~12 min ETA
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-stone-700 sm:block" />

                <span className="flex items-center gap-1.5">
                  <CircleDot className="h-3 w-3 text-purple-400" />
                  Indiranagar
                </span>
              </div>


              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-2.5
                  sm:grid-cols-[auto_1fr]
                "
              >

                {/* Navigation */}
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      'Opening Turn-by-Turn GPS Map...',
                      'info'
                    )
                  }
                  className="
                    flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-stone-700
                    bg-stone-800
                    px-5
                    py-3
                    text-[10px]
                    font-bold
                    text-white
                    transition
                    hover:bg-stone-700
                    active:scale-[0.99]
                    sm:min-h-[52px]
                    sm:rounded-2xl
                  "
                >
                  <Navigation
                    className="
                      h-4
                      w-4
                      text-emerald-400
                    "
                  />

                  <span>
                    Launch Turn-by-Turn Route
                  </span>

                  <ChevronRight className="h-3.5 w-3.5 text-stone-500" />
                </button>


                {/* Main action */}
                <button
                  type="button"
                  onClick={handleAdvanceTask}
                  className={`
                    flex
                    min-h-[52px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-4
                    py-3.5
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wide
                    shadow-lg
                    transition
                    active:scale-[0.99]
                    sm:rounded-2xl
                    ${
                      taskStep === 'COMPLETED'
                        ? `
                          bg-emerald-500
                          text-stone-950
                          shadow-emerald-500/10
                          hover:bg-emerald-400
                        `
                        : `
                          bg-gradient-to-r
                          from-amber-500
                          to-orange-500
                          text-stone-950
                          shadow-amber-500/20
                          hover:from-amber-400
                          hover:to-orange-400
                        `
                    }
                  `}
                >

                  <CheckCircle2 className="h-4 w-4 shrink-0" />

                  <span className="text-center">
                    {getTaskTitle()}
                  </span>

                </button>

              </div>


              {/* =================================================
                  TASK INFO
              ================================================== */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-center
                  text-[9px]
                  text-stone-600
                "
              >
                <Sparkles className="h-3 w-3 text-amber-500/60" />

                <span>
                  {getTaskDescription()}
                </span>
              </div>


              {/* =================================================
                  CONTACT
              ================================================== */}

              {taskStep !== 'COMPLETED' && (
                <div className="mt-4 grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        'Calling Burger Lab & Smokehouse...',
                        'info'
                      )
                    }
                    className="
                      flex
                      min-h-[44px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-stone-800
                      bg-stone-950
                      text-[9px]
                      font-bold
                      text-stone-400
                      transition
                      hover:border-stone-700
                      hover:text-white
                    "
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call Restaurant
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        'Customer contact opened.',
                        'info'
                      )
                    }
                    className="
                      flex
                      min-h-[44px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-stone-800
                      bg-stone-950
                      text-[9px]
                      font-bold
                      text-stone-400
                      transition
                      hover:border-stone-700
                      hover:text-white
                    "
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Contact Customer
                  </button>

                </div>
              )}

            </div>
          </section>


          {/* =====================================================
              MOBILE / RIDER NOTE
          ====================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-stone-800
              bg-stone-900/60
              p-4
              sm:rounded-3xl
              sm:p-5
            "
          >

            <div className="flex items-start gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-500/10
                  text-emerald-400
                "
              >
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div className="min-w-0">

                <h3 className="text-xs font-bold text-white">
                  Rider safety reminder
                </h3>

                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-relaxed
                    text-stone-500
                    sm:text-[10px]
                  "
                >
                  Drive safely, follow traffic rules and
                  never interact with the app while riding.
                  Your safety comes first.
                </p>

              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
};


/* =============================================================
   METRIC CARD
============================================================= */

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueSuffix?: string;
  sub: string;
  subPositive?: boolean;
  accent?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  valueSuffix,
  sub,
  subPositive,
  accent,
}) => {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-stone-800
        bg-stone-900
        p-3
        shadow-lg
        shadow-black/5
        sm:rounded-2xl
        sm:p-4
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >

        <span
          className="
            truncate
            text-[8px]
            font-bold
            uppercase
            tracking-wider
            text-stone-500
            sm:text-[10px]
          "
        >
          {label}
        </span>

        <span
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-stone-950
            text-stone-500
            sm:h-8
            sm:w-8
          "
        >
          {icon}
        </span>

      </div>


      <div
        className={`
          mt-2
          truncate
          font-mono
          text-lg
          font-black
          tracking-tight
          sm:text-2xl
          ${
            accent
              ? 'text-amber-400'
              : 'text-white'
          }
        `}
      >
        {value}

        {valueSuffix && (
          <span
            className="
              text-[9px]
              font-bold
              text-stone-400
              sm:text-xs
            "
          >
            {valueSuffix}
          </span>
        )}
      </div>


      <p
        className={`
          mt-1
          truncate
          text-[8px]
          font-semibold
          sm:text-[9px]
          ${
            subPositive
              ? 'text-emerald-400'
              : 'text-stone-600'
          }
        `}
      >
        {sub}
      </p>

    </div>
  );
};


/* =============================================================
   LOCATION CARD
============================================================= */

interface LocationCardProps {
  type: string;
  status: string;
  statusTone: 'green' | 'amber';
  title: string;
  address: string;
  distance: string;
  icon: React.ReactNode;
}

const LocationCard: React.FC<LocationCardProps> = ({
  type,
  status,
  statusTone,
  title,
  address,
  distance,
  icon,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-stone-800
        bg-stone-950
        p-3.5
        sm:p-4
      "
    >

      {/* Top */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >

          <span
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-stone-900
              text-stone-500
            "
          >
            {icon}
          </span>

          <span
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.14em]
              text-stone-500
            "
          >
            {type}
          </span>

        </div>


        <span
          className={`
            shrink-0
            rounded-full
            px-2
            py-1
            text-[8px]
            font-bold
            ${
              statusTone === 'green'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-amber-500/10 text-amber-400'
            }
          `}
        >
          {status}
        </span>

      </div>


      {/* Content */}
      <div className="mt-3">

        <h3
          className="
            truncate
            text-sm
            font-bold
            text-white
          "
        >
          {title}
        </h3>

        <div
          className="
            mt-1.5
            flex
            items-start
            gap-1.5
          "
        >

          <MapPin
            className="
              mt-0.5
              h-3
              w-3
              shrink-0
              text-stone-600
            "
          />

          <p
            className="
              text-[9px]
              leading-relaxed
              text-stone-500
            "
          >
            {address}
          </p>

        </div>


        <div
          className="
            mt-2
            flex
            items-center
            gap-1.5
            text-[8px]
            font-semibold
            text-stone-600
          "
        >
          <Navigation className="h-3 w-3" />

          {distance}
        </div>

      </div>
    </div>
  );
};


/* =============================================================
   TASK PROGRESS
============================================================= */

interface TaskProgressProps {
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
  label: string;
}

const TaskProgress: React.FC<TaskProgressProps> = ({
  active,
  completed,
  icon,
  label,
}) => {
  return (
    <div
      className="
        flex
        min-w-[58px]
        flex-col
        items-center
        gap-1.5
      "
    >

      <div
        className={`
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border
          transition
          ${
            completed
              ? `
                border-emerald-500
                bg-emerald-500
                text-stone-950
              `
              : active
              ? `
                border-amber-500
                bg-amber-500/15
                text-amber-400
              `
              : `
                border-stone-800
                bg-stone-950
                text-stone-600
              `
          }
        `}
      >
        {icon}
      </div>


      <span
        className={`
          text-[8px]
          font-bold
          ${
            completed
              ? 'text-emerald-400'
              : active
              ? 'text-amber-400'
              : 'text-stone-600'
          }
        `}
      >
        {label}
      </span>

    </div>
  );
};