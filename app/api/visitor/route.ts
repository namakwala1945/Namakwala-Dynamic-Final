import { NextResponse } from "next/server";

type VisitorLog = {
  timestamp: number; // store visit time
};

const initialOffset = 2500;
let logs: VisitorLog[] = [];

// POST -> add a new visitor
export async function POST() {
  const now = Date.now();
  logs.push({ timestamp: now });

  return NextResponse.json({ message: "Visitor added" });
}

// GET -> return stats only
export async function GET() {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let dayCount = 0;
  let monthCount = 0;
  let yearCount = 0;

  logs.forEach((log) => {
    const d = new Date(log.timestamp);
    if (d.getFullYear() === currentYear) {
      yearCount++;
      if (d.getMonth() === currentMonth) {
        monthCount++;
        if (d.getDate() === currentDay) {
          dayCount++;
        }
      }
    }
  });

  return NextResponse.json({
    total: logs.length + initialOffset,
    today: dayCount,
    month: monthCount,
    year: yearCount,
  });
}
