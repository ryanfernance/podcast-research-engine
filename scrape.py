"""
Geronimo Podcast Scraper v2 — No Shorts
Only pulls videos 10+ minutes (actual podcast episodes).

Usage:
  pip3 install requests anthropic
  export YOUTUBE_API_KEY="xxx"
  export ANTHROPIC_API_KEY="xxx"
  python3 scrape.py
"""

import os, sys, json, time, re
from datetime import datetime, timedelta, timezone
from statistics import median
from math import ceil

import requests

YT_KEY = os.environ.get("YOUTUBE_API_KEY")
ANTH_KEY = os.environ.get("ANTHROPIC_API_KEY")
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
]

LOOKBACK_DAYS = 730
MAX_VIDS_PER_CHANNEL = 300
MIN_DURATION_SECONDS = 600  # 10 minutes minimum


def parse_duration(iso_duration):
    """Parse ISO 8601 duration (PT1H23M45S) to seconds."""
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
            # Skip obvious shorts from title
            if "#shorts" in title.lower() or "#short" in title.lower():
                continue
            videos.append({
                "id": s["resourceId"]["videoId"],
                "title": title,
                "description": s.get("description", "")[:400],
                "date": pub.strftime("%Y-%m-%d"),
                "thumbnail": s.get("thumbnails", {}).get("high", {}).get("url", ""),
            })
        npt = d.get("nextPageToken")
        if not npt:
            break
        time.sleep(0.1)
    return videos


def get_stats_and_duration(video_ids):
    """Get stats AND duration. Returns dict with views, likes, comments, duration_seconds."""
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


def tag_videos(videos):
    """Tag videos with Claude if ANTHROPIC_API_KEY is set."""
    if not ANTH_KEY:
        print("  No ANTHROPIC_API_KEY set — skipping tagging")
        return {}

    try:
        from anthropic import Anthropic
    except ImportError:
        print("  anthropic package not installed — skipping tagging")
        return {}

    client = Anthropic(api_key=ANTH_KEY)
    prompt = """Tag each video. Return ONLY valid JSON array, no markdown.
TOPICS (1-3): business_growth, mindset, health_fitness, relationships, money, leadership, personal_story, science_research, culture_society, marketing, sales, operations, fitness_industry, coaching, entrepreneurship
ANGLES (1-2): contrarian_take, personal_vulnerability, how_to_tactical, myth_busting, emotional_hook, transformation_story, data_driven, interview_deep_dive, shock_value, aspirational, behind_the_scenes
[{"id":"xxx","topics":["t1"],"angles":["a1"],"sum":"One sentence summary"}]
VIDEOS:
"""
    all_tags = {}
    for i in range(0, len(videos), 15):
        batch = videos[i:i + 15]
        txt = "\n".join([f"ID:{v['id']} CH:{v['ch']} TITLE:{v['title']}" for v in batch])
        try:
            r = client.messages.create(model="claude-sonnet-4-20250514", max_tokens=3000,
                                       messages=[{"role": "user", "content": prompt + txt}])
            raw = r.content[0].text.replace("```json", "").replace("```", "").strip()
            for t in json.loads(raw):
                all_tags[t["id"]] = t
        except Exception as e:
            print(f"    Tag error batch {i // 15 + 1}: {e}")
        print(f"    Tag batch {i // 15 + 1}/{ceil(len(videos) / 15)} done")
        time.sleep(0.5)
    return all_tags


def main():
    if not YT_KEY:
        print("ERROR: Set YOUTUBE_API_KEY")
        sys.exit(1)

    after = datetime.now(timezone.utc) - timedelta(days=LOOKBACK_DAYS)
    all_videos = []

    print(f"\n{'=' * 60}")
    print(f"GERONIMO PODCAST SCRAPER v2 (No Shorts)")
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

        # Get stats AND duration
        ids = [v["id"] for v in videos]
        stats = get_stats_and_duration(ids)

        for v in videos:
            s = stats.get(v["id"], {})
            v["views"] = s.get("views", 0)
            v["likes"] = s.get("likes", 0)
            v["comments"] = s.get("comments", 0)
            v["duration_seconds"] = s.get("duration_seconds", 0)
            v["ch"] = name

        # FILTER: Remove shorts and short videos (under 10 minutes)
        before_count = len(videos)
        videos = [v for v in videos if v["duration_seconds"] >= MIN_DURATION_SECONDS]
        shorts_removed = before_count - len(videos)

        # Filter out zero-view videos
        videos = [v for v in videos if v["views"] > 0]

        if not videos:
            print(f"  No long-form videos found (removed {shorts_removed} shorts/short videos)")
            continue

        # Calculate performance index
        view_counts = [v["views"] for v in videos]
        med = median(view_counts) if view_counts else 1
        for v in videos:
            v["med"] = round(med)
            v["pi"] = round(v["views"] / med, 2) if med > 0 else 0

        # Keep only above-median performers
        top = [v for v in videos if v["pi"] >= 1.5]
        top.sort(key=lambda x: x["pi"], reverse=True)
        top = top[:20]

        print(f"  Found {len(videos)} episodes (removed {shorts_removed} shorts), {len(top)} above 1.5x (median: {med:,.0f})")
        all_videos.extend(top)

    print(f"\n{'=' * 60}")
    print(f"Total podcast episodes to process: {len(all_videos)}")
    print(f"{'=' * 60}\n")

    # Tag with Claude
    if all_videos:
        print("Tagging with Claude...")
        tags = tag_videos(all_videos)
        for v in all_videos:
            t = tags.get(v["id"], {})
            v["topics"] = t.get("topics", [])
            v["angles"] = t.get("angles", [])
            if t.get("sum"):
                v["sum"] = t["sum"]
            else:
                v["sum"] = v["title"]

    # Clean up for output
    output = []
    for v in all_videos:
        output.append({
            "id": v["id"],
            "ch": v["ch"],
            "title": v["title"],
            "sum": v.get("sum", v["title"]),
            "date": v["date"],
            "views": v["views"],
            "med": v["med"],
            "pi": v["pi"],
            "topics": v.get("topics", []),
            "angles": v.get("angles", []),
        })

    output.sort(key=lambda x: x["pi"], reverse=True)

    with open("data.json", "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n{'=' * 60}")
    print(f"DONE — {len(output)} podcast episodes written to data.json")
    print(f"(All videos are 10+ minutes — no Shorts)")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
