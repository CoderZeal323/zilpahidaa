/**
 * Supabase client for likes, ratings, and subscribers.
 *
 * SETUP (one time, takes 2 minutes):
 * 1. Create a free project at https://supabase.com
 * 2. Run the SQL in supabase-schema.sql in your Supabase SQL Editor
 * 3. Go to Project Settings → API → copy your URL and anon key
 * 4. Replace SUPABASE_URL and SUPABASE_ANON_KEY below
 */

const SUPABASE_URL = "https://ojwxqnffyksaofvoqiqb.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qd3hxbmZmeWtzYW9mdm9xaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODc2ODUsImV4cCI6MjA5MDI2MzY4NX0.Lrj5q5d2s2MbEKOktfFxz3l4S1TdCARHEQw8JC0addE";

// Visitor fingerprint (anonymous, stored in localStorage)
function getVisitorId() {
  let id = localStorage.getItem("_zi_vid");
  if (!id) {
    id =
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);
    localStorage.setItem("_zi_vid", id);
  }
  return id;
}

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Supabase error ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── Likes ──────────────────────────────────────────────────────────────────

export async function getLikeStatus(postSlug) {
  const visitorId = getVisitorId();
  const [total, mine] = await Promise.all([
    sbFetch(`likes?post_slug=eq.${encodeURIComponent(postSlug)}&select=count`, {
      headers: { Prefer: "count=exact" },
    })
      .then(() => 0)
      .catch(() => 0),
    sbFetch(
      `likes?post_slug=eq.${encodeURIComponent(postSlug)}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=id`
    ).catch(() => []),
  ]);

  const countRes = await sbFetch(
    `likes?post_slug=eq.${encodeURIComponent(postSlug)}&select=id`
  ).catch(() => []);

  return {
    count: Array.isArray(countRes) ? countRes.length : 0,
    liked: Array.isArray(mine) && mine.length > 0,
  };
}

export async function toggleLike(postSlug) {
  const visitorId = getVisitorId();
  const existing = await sbFetch(
    `likes?post_slug=eq.${encodeURIComponent(postSlug)}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=id`
  ).catch(() => []);

  if (Array.isArray(existing) && existing.length > 0) {
    await sbFetch(
      `likes?post_slug=eq.${encodeURIComponent(postSlug)}&visitor_id=eq.${encodeURIComponent(visitorId)}`,
      { method: "DELETE", prefer: "return=minimal" }
    ).catch(() => {});
    return { liked: false };
  } else {
    await sbFetch("likes", {
      method: "POST",
      body: JSON.stringify({ post_slug: postSlug, visitor_id: visitorId }),
      prefer: "return=minimal",
    }).catch(() => {});
    return { liked: true };
  }
}

// ── Ratings ────────────────────────────────────────────────────────────────

export async function getRatings(postSlug) {
  const data = await sbFetch(
    `ratings?post_slug=eq.${encodeURIComponent(postSlug)}&select=id,score,review,name,created_at&order=created_at.desc`
  ).catch(() => []);

  const list = Array.isArray(data) ? data : [];
  const avg =
    list.length > 0
      ? list.reduce((s, r) => s + r.score, 0) / list.length
      : 0;

  const visitorId = getVisitorId();
  const mine = await sbFetch(
    `ratings?post_slug=eq.${encodeURIComponent(postSlug)}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=score`
  ).catch(() => []);

  return {
    ratings: list,
    avg: Math.round(avg * 10) / 10,
    count: list.length,
    myRating: Array.isArray(mine) && mine.length > 0 ? mine[0].score : 0,
  };
}

export async function submitRating(postSlug, score, name, review) {
  const visitorId = getVisitorId();
  const payload = {
    post_slug: postSlug,
    visitor_id: visitorId,
    score,
    name: name || "Anonymous",
    review: review || "",
  };
  const existing = await sbFetch(
    `ratings?post_slug=eq.${encodeURIComponent(postSlug)}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=id`
  ).catch(() => []);

  if (Array.isArray(existing) && existing.length > 0) {
    await sbFetch(
      `ratings?post_slug=eq.${encodeURIComponent(postSlug)}&visitor_id=eq.${encodeURIComponent(visitorId)}`,
      { method: "PATCH", body: JSON.stringify({ score, name: name || "Anonymous", review: review || "" }), prefer: "return=minimal" }
    );
  } else {
    await sbFetch("ratings", {
      method: "POST",
      body: JSON.stringify(payload),
      prefer: "return=minimal",
    });
  }
}

// ── Subscribers ────────────────────────────────────────────────────────────

export async function subscribeEmail(email, name) {
  await sbFetch("subscribers", {
    method: "POST",
    body: JSON.stringify({ email, name: name || "" }),
    prefer: "return=minimal",
    headers: { Prefer: "return=minimal,resolution=ignore-duplicates" },
  });
}
