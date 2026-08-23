"use client";

type PlannerDayTabsProps = {
  weekStartDate: string;

  selectedDate: string;

  onSelectDate: (
    date: string
  ) => void;
};

type PlannerDay = {
  date: string;
  shortDay: string;
  dayNumber: string;
};

function buildWeekDays(
  weekStartDate: string
): PlannerDay[] {
  const startDate =
    new Date(
      `${weekStartDate}T00:00:00`
    );

  return Array.from(
    {
      length: 7,
    },
    (
      _,
      index
    ) => {
      const date =
        new Date(
          startDate
        );

      date.setDate(
        startDate.getDate() +
          index
      );

      const isoDate =
        [
          date.getFullYear(),
          String(
            date.getMonth() +
              1
          ).padStart(
            2,
            "0"
          ),
          String(
            date.getDate()
          ).padStart(
            2,
            "0"
          ),
        ].join("-");

      return {
        date:
          isoDate,

        shortDay:
          date.toLocaleDateString(
            "en-GB",
            {
              weekday:
                "short",
            }
          ),

        dayNumber:
          String(
            date.getDate()
          ),
      };
    }
  );
}

export default function PlannerDayTabs({
  weekStartDate,
  selectedDate,
  onSelectDate,
}: PlannerDayTabsProps) {
  const weekDays =
    buildWeekDays(
      weekStartDate
    );

  return (
    <section className="rounded-2xl border border-[#EADCC4] bg-white p-2 shadow-sm">
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(
          (day) => {
            const isSelected =
              day.date ===
              selectedDate;

            return (
              <button
                key={
                  day.date
                }
                type="button"
                onClick={() =>
                  onSelectDate(
                    day.date
                  )
                }
                className={`flex min-w-0 flex-col items-center justify-center rounded-xl px-1 py-2.5 transition ${
                  isSelected
                    ? "bg-[#2F6B3C] text-white shadow-sm"
                    : "text-[#5A4032] active:bg-[#F3F8F4]"
                }`}
              >
                <span
                  className={`text-[11px] font-semibold uppercase ${
                    isSelected
                      ? "text-white/80"
                      : "text-[#8A8178]"
                  }`}
                >
                  {
                    day.shortDay
                  }
                </span>

                <span className="mt-1 text-sm font-bold">
                  {
                    day.dayNumber
                  }
                </span>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}