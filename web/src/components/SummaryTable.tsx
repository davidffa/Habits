import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { HabitDay } from './HabitDay';
import { generateDatesFromYearStart } from '../utils/generate-dates-from-year-start';

import { api } from '../lib/api';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const summaryDates = generateDatesFromYearStart();

const minSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minSummaryDatesSize - summaryDates.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get('summary').then(res => {
      setSummary(res.data);
    });
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {
          weekDays.map((day, i) => (
            <div key={`${day}-${i}`} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
              {day}
            </div>
          ))
        }
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {
          summary.length > 0 &&
          summaryDates.map(date => {
            const datyInSummary = summary.find(day => {
              return dayjs(date).isSame(day.date, 'day');
            });

            return (
              <HabitDay
                key={date.toISOString()}
                date={date}
                amount={datyInSummary?.amount}
                defaultCompleted={datyInSummary?.completed}
              />
            )
          })
        }

        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
          return (
            <div key={i} className="w-10 h-10 bg-zinc-900 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
          );
        })}
      </div>
    </div>
  )
}