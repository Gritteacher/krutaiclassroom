import { fallbackPosts, fallbackProjects } from "./fallback";
import { isSupabaseConfigured, supabase } from "./supabase";
import type { Post, Project } from "./types";

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) return fallbackProjects;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  if (!isSupabaseConfigured || !supabase) {
    return typeof limit === "number" ? fallbackPosts.slice(0, limit) : fallbackPosts;
  }
  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (typeof limit === "number") query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data as Post | null;
}
