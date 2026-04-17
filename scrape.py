"""
Geronimo Podcast Scraper v3 — No Shorts, Keyword Tagged
Only pulls videos 10+ minutes (actual podcast episodes).
Tags every video with topics and angles using keyword matching.

Usage:
  pip3 install requests
  export YOUTUBE_API_KEY="xxx"
  python3 scrape.py
"""

import os, sys, json, time, re
from datetime import datetime, timedelta, timezone
from statistics import median
from math import ceil

import requests

YT_KEY = os.environ.get("YOUTUBE_API_KEY")
YT = "https://www.googleapis.com/youtube/v3"

CHANNELS = [
    ("@TheDiaryOfACEO", "Diary of a CEO"),
    ("@AlexHormozi", "Alex Hormozi"),
    ("@ChrisWillx", "Chris Williamson"),
    ("@hubermanlab", "Andrew Huberman"),
    ("@simonsinek", "Simon Sinek"),
    ("@EdMylett", "Ed Mylett"),
    ("@GaryVee", "GaryVee"),
    ("@LewisHowes", "Lewis Howes"),
    ("@CodieSanchezCT", "Codie Sanchez"),
    ("@CalebHammer", "Caleb Hammer"),
    ("@JamesSmithPT", "James Smith"),
    ("@MindPumpShow", "Mind Pump"),
    ("@TimFerriss", "Tim Ferriss"),
    ("@JockoPodcastOfficial", "Jocko Willink"),
    ("@MyFirstMillionPod", "My First Million"),
    ("@profgalloway", "Scott Galloway"),
    ("@TakiMoore", "Taki Moore"),
    ("@MelRobbins", "Mel Robbins"),
    ("@DrRanganChatterjee", "Dr Rangan Chatterjee"),
    ("@richroll", "Rich Roll"),
    ("@MarkBouris", "Mark Bouris"),
    ("@shesonthemoney", "She's On The Money"),
    ("@JeffNippard", "Jeff Nippard"),
    ("@GrantCardone", "Grant Cardone"),
    ("@jaborowsky", "Jay Shetty"),
    ("@ImpactTheoryUniversity", "Tom Bilyeu"),
    ("@ColinandSamirShow", "Colin and Samir"),
    ("@TheRamseyShow", "The Ramsey Show"),
    ("@EverydaySpy", "EverydaySpy"),
    ("@GraceBeverley", "Grace Beverley"),
    ("@PeterDiamandis", "Peter Diamandis"),
    ("@EconomicsExplained", "Economics Explained"),
    ("@TheIcedCoffeeHour", "The Iced Coffee Hour"),
    ("@ChewTheFatPod", "Chew The Fat Pod"),
]

LOOKBACK_DAYS = 730
MAX_VIDS_PER_CHANNEL = 300
MIN_DURATION_SECONDS = 600


def parse_duration(iso_duration):
    if not iso_duration:
        return 0
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', iso_duration)
    if not match:
        return 0
    h = int(match.group(1) or 0)
    m = int(match.group(2) or 0)
    s = int(match.group(3) or 0)
    return h * 3600 + m * 60 + s


def resolve_channel(handle):
    clean = handle.lstrip("@")
    r = requests.get(f"{YT}/channels", params={"key": YT_KEY, "forHandle": clean, "part": "id"})
    d = r.json()
    if d.get("items"):
        return d["items"][0]["id"]
    r = requests.get(f"{YT}/search", params={"key": YT_KEY, "q": handle, "type": "channel", "part": "snippet", "maxResults": 1})
    d = r.json()
    if d.get("items"):
        return d["items"][0]["snippet"]["channelId"]
    return None


def get_videos(channel_id, after):
    playlist_id = "UU" + channel_id[2:]
    videos, npt = [], None
    while len(videos) < MAX_VIDS_PER_CHANNEL:
        params = {"key": YT_KEY, "playlistId": playlist_id, "part": "snippet", "maxResults": 50}
        if npt:
            params["pageToken"] = npt
        r = requests.get(f"{YT}/playlistItems", params=params)
        d = r.json()
        if "error" in d:
            print(f"    API error: {d['error'].get('message', 'unknown')}")
            break
        for item in d.get("items", []):
            s = item["snippet"]
            pub = datetime.fromisoformat(s["publishedAt"].replace("Z", "+00:00"))
            if pub < after:
                return videos
            title = s.get("title", "")
            if "#shorts" in title.lower() or "#short" in title.lower():
                continue
            videos.append({
                "id": s["resourceId"]["videoId"],
                "title": title,
                "description": s.get("description", "")[:400],
                "date": pub.strftime("%Y-%m-%d"),
            })
        npt = d.get("nextPageToken")
        if not npt:
            break
        time.sleep(0.1)
    return videos


def get_stats_and_duration(video_ids):
    stats = {}
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i:i + 50]
        r = requests.get(f"{YT}/videos", params={
            "key": YT_KEY,
            "id": ",".join(batch),
            "part": "statistics,contentDetails"
        })
        for item in r.json().get("items", []):
            s = item["statistics"]
            duration = item.get("contentDetails", {}).get("duration", "")
            stats[item["id"]] = {
                "views": int(s.get("viewCount", 0)),
                "likes": int(s.get("likeCount", 0)),
                "comments": int(s.get("commentCount", 0)),
                "duration_seconds": parse_duration(duration),
            }
        time.sleep(0.1)
    return stats


def keyword_tag(videos):
    topic_kw = {
        "business_growth": ["business", "grow", "scale", "revenue", "profit", "company", "startup", "million", "billion", "income", "success", "empire", "wealth"],
        "mindset": ["mindset", "discipline", "motivation", "habits", "psychology", "brain", "mental", "think", "belief", "confidence", "fear", "anxiety", "stoic", "resilience", "purpose", "meaning", "emotion", "dream", "autopilot"],
        "health_fitness": ["health", "fitness", "exercise", "workout", "diet", "nutrition", "weight", "fat", "muscle", "body", "sleep", "longevity", "aging", "biohack", "supplement", "protein", "testosterone", "hormone", "gut"],
        "money": ["money", "finance", "invest", "debt", "savings", "retire", "budget", "wealth", "broke", "rich", "poor", "financial", "stock", "crypto", "economy", "inflation", "tax", "salary", "real estate"],
        "leadership": ["leader", "leadership", "team", "manage", "culture", "hire", "CEO", "founder", "boss", "employee"],
        "marketing": ["marketing", "ads", "advertising", "content", "social media", "brand", "viral", "audience", "algorithm", "youtube", "instagram", "tiktok", "SEO", "attention"],
        "sales": ["sales", "sell", "selling", "close", "pitch", "offer", "conversion", "customer", "client", "deal"],
        "operations": ["systems", "automate", "process", "operations", "efficiency", "delegate", "outsource", "SOP"],
        "fitness_industry": ["gym", "studio", "trainer", "PT", "personal train", "CrossFit", "F45", "boutique", "fitness business", "group fitness"],
        "coaching": ["coach", "coaching", "mentor", "consulting", "advisory"],
        "personal_story": ["story", "journey", "lost everything", "rebuilt", "failed", "bankruptcy", "truth about", "my life", "struggle", "overcame", "quitting", "gave up", "roadblock"],
        "relationships": ["relationship", "marriage", "dating", "love", "partner", "divorce", "family", "friendship", "lonely", "loneliness", "men", "women"],
        "culture_society": ["society", "culture", "generation", "gender", "politics", "crisis", "epidemic", "modern", "world", "america", "war", "AI", "technology", "future"],
        "science_research": ["science", "research", "study", "neuroscience", "data", "evidence", "protocol", "dopamine", "cortisol", "brain", "surgeon", "doctor", "dr"],
        "entrepreneurship": ["entrepreneur", "startup", "founder", "built", "start a business", "side hustle", "quit your job", "self-employed", "acquisition"],
    }
    angle_kw = {
        "contrarian_take": ["lie", "lying", "wrong", "myth", "stop", "don't", "never", "truth", "actually", "secret", "nobody tells", "overrated", "unpopular"],
        "how_to_tactical": ["how to", "step", "strategy", "framework", "system", "hack", "tip", "rule", "method", "way to", "guide", "blueprint", "playbook", "unlock", "build"],
        "emotional_hook": ["cry", "depressed", "depression", "lonely", "lost", "struggle", "pain", "dark", "honest", "vulnerable", "broke down", "died", "death", "grief", "roadblock"],
        "transformation_story": ["transformed", "went from", "changed my life", "journey", "turnaround", "before", "after", "comeback", "transform"],
        "data_driven": ["data", "research", "study", "science", "number", "statistic", "percent", "evidence", "experiment"],
        "myth_busting": ["myth", "lie", "debunk", "wrong", "actually", "truth about", "stop believing"],
        "shock_value": ["broke", "insane", "crazy", "shocking", "unbelievable", "controversial", "banned", "fired", "scam", "fraud", "exposed", "storm"],
        "interview_deep_dive": ["interview", "conversation", "sits down", "opens up", "tells all", "exclusive", "finally", "first time", "feat"],
        "behind_the_scenes": ["behind the scenes", "inside", "day in", "routine", "how I", "my process", "real life", "tour"],
        "aspirational": ["millionaire", "billionaire", "empire", "dream", "freedom", "lifestyle", "luxury", "successful", "$", "wealth beyond"],
        "personal_vulnerability": ["opens up", "honest", "vulnerable", "struggle", "depression", "anxiety", "fear", "admit", "alone", "friendship", "loneliness"],
    }
    tagged = 0
    for v in videos:
        tl = v.get("title", "").lower()
        scores = {}
        for topic, kws in topic_kw.items():
            s = sum(1 for kw in kws if kw.lower() in tl)
            if s > 0:
                scores[topic] = s
        v["topics"] = sorted(scores, key=scores.get, reverse=True)[:2] if scores else ["business_growth"]
        ascores = {}
        for angle, kws in angle_kw.items():
            s = sum(1 for kw in kws if kw.lower() in tl)
            if s > 0:
                ascores[angle] = s
        v["angles"] = sorted(ascores, key=ascores.get, reverse=True)[:2] if ascores else ["interview_deep_dive"]
        tagged += 1
    print(f"  Keyword-tagged {tagged} videos")


def main():
    if not YT_KEY:
        print("ERROR: Set YOUTUBE_API_KEY")
        sys.exit(1)

    after = datetime.now(timezone.utc) - timedelta(days=LOOKBACK_DAYS)
    all_videos = []

    print(f"\n{'=' * 60}")
    print(f"GERONIMO PODCAST SCRAPER v3 (No Shorts, Keyword Tagged)")
    print(f"Channels: {len(CHANNELS)} | Lookback: {LOOKBACK_DAYS} days")
    print(f"Min duration: {MIN_DURATION_SECONDS // 60} minutes")
    print(f"{'=' * 60}\n")

    for handle, name in CHANNELS:
        print(f"[{name}] Resolving channel...")
        cid = resolve_channel(handle)
        if not cid:
            print(f"  SKIP: Could not resolve {handle}")
            continue

        print(f"  Pulling videos...")
        videos = get_videos(cid, after)
        if not videos:
            print(f"  No videos found")
            continue

        ids = [v["id"] for v in videos]
        stats = get_stats_and_duration(ids)

        for v in videos:
            s = stats.get(v["id"], {})
            v["views"] = s.get("views", 0)
            v["likes"] = s.get("likes", 0)
            v["comments"] = s.get("comments", 0)
            v["duration_seconds"] = s.get("duration_seconds", 0)
            v["ch"] = name

        before_count = len(videos)
        videos = [v for v in videos if v["duration_seconds"] >= MIN_DURATION_SECONDS]
        shorts_removed = before_count - len(videos)
        videos = [v for v in videos if v["views"] > 0]

        if not videos:
            print(f"  No long-form videos found (removed {shorts_removed} shorts/short videos)")
            continue

        view_counts = [v["views"] for v in videos]
        med = median(view_counts) if view_counts else 1
        for v in videos:
            v["med"] = round(med)
            v["pi"] = round(v["views"] / med, 2) if med > 0 else 0

        top = [v for v in videos if v["pi"] >= 1.5]
        top.sort(key=lambda x: x["pi"], reverse=True)
        top = top[:20]

        print(f"  Found {len(videos)} episodes (removed {shorts_removed} shorts), {len(top)} above 1.5x (median: {med:,.0f})")
        all_videos.extend(top)

    print(f"\n{'=' * 60}")
    print(f"Total podcast episodes: {len(all_videos)}")
    print(f"{'=' * 60}\n")

    output = []
    for v in all_videos:
        output.append({
            "id": v["id"],
            "ch": v["ch"],
            "title": v["title"],
            "sum": v["title"],
            "date": v["date"],
            "views": v["views"],
            "med": v["med"],
            "pi": v["pi"],
            "topics": [],
            "angles": [],
        })

    keyword_tag(output)
    output.sort(key=lambda x: x["pi"], reverse=True)

    with open("data.json", "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n{'=' * 60}")
    print(f"DONE — {len(output)} podcast episodes written to data.json")
    print(f"(All videos are 10+ minutes, keyword tagged, no Shorts)")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
