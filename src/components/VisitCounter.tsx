import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const SESSION_KEY = "krutaiclassroom-visit-recorded";
let visitRequest: Promise<number | null> | null = null;

async function loadVisitCount() {
  if (!isSupabaseConfigured || !supabase) return null;

  const alreadyRecorded = sessionStorage.getItem(SESSION_KEY) === "1";
  if (!alreadyRecorded) sessionStorage.setItem(SESSION_KEY, "1");

  const { data, error } = await supabase.rpc(
    alreadyRecorded ? "get_visit_count" : "record_visit",
  );

  if (error) {
    if (!alreadyRecorded) sessionStorage.removeItem(SESSION_KEY);
    return null;
  }

  const count = Number(data);
  return Number.isFinite(count) ? count : null;
}

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    visitRequest ??= loadVisitCount();
    visitRequest.then(setCount);
  }, []);

  if (count === null) return null;

  return (
    <span className="visit-counter" aria-label={`มีผู้เข้าชมทั้งหมด ${count.toLocaleString("th-TH")} ครั้ง`}>
      ผู้เข้าชม {count.toLocaleString("th-TH")} ครั้ง
    </span>
  );
}
