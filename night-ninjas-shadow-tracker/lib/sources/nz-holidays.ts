import 'server-only';

/**
 * NZ public holidays fetcher.
 *
 * Source: https://github.com/sohnemann/New-Zealand-Public-Holidays
 *
 * iCal file covering 2022-2032, maintained by Marcel Söhnemann. Includes
 * national holidays + regional anniversaries + Mondayised observed dates.
 *
 * iCal format is structured by design — way more reliable than scraping
 * HTML. Format per event:
 *
 *   BEGIN:VEVENT
 *   SUMMARY:Holiday Name
 *   DTSTART;VALUE=DATE:YYYYMMDD
 *   DTEND;VALUE=DATE:YYYYMMDD
 *   ...
 *   END:VEVENT
 */

const ICAL_URL =
  'https://raw.githubusercontent.com/sohnemann/New-Zealand-Public-Holidays/main/2022-2032-public-holidays-nz-all.ics';

export interface ParsedHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  region: string | null; // null = national
  year: number;
}

/**
 * Region names that appear in SUMMARY for regional anniversaries.
 * If the SUMMARY contains one of these followed by " Anniversary", we
 * treat it as a regional event.
 */
const REGION_NAMES = [
  'Auckland',
  'Wellington',
  'Canterbury',
  'South Canterbury',
  'Marlborough',
  'Nelson',
  'Otago',
  'Southland',
  'Taranaki',
  "Hawke's Bay",
  'Westland',
  'Chatham Islands',
];

/** Parse YYYYMMDD into ISO YYYY-MM-DD. */
function dtstartToIso(value: string): string | null {
  const match = value.match(/(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return match[1] + '-' + match[2] + '-' + match[3];
}

/** Identify the region from a SUMMARY string, if any. */
function regionFromSummary(summary: string): string | null {
  for (const region of REGION_NAMES) {
    if (summary.startsWith(region + ' Anniversary')) {
      return region;
    }
  }
  return null;
}

/**
 * Parse an iCal text body into ParsedHoliday[].
 *
 * State machine: walk line by line, tracking whether we're inside a VEVENT,
 * collecting SUMMARY and DTSTART, emitting when we hit END:VEVENT.
 */
export function parseIcal(text: string): ParsedHoliday[] {
  const out: ParsedHoliday[] = [];
  // Normalize line endings and unfold continuation lines (RFC 5545: lines
  // starting with a single space are continuations of the previous line)
  const normalized = text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
  const lines = normalized.split('\n');

  let inEvent = false;
  let summary: string | null = null;
  let dtstart: string | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      summary = null;
      dtstart = null;
      continue;
    }
    if (line === 'END:VEVENT') {
      if (summary && dtstart) {
        const iso = dtstartToIso(dtstart);
        if (iso) {
          const year = parseInt(iso.slice(0, 4), 10);
          out.push({
            date: iso,
            name: summary,
            region: regionFromSummary(summary),
            year,
          });
        }
      }
      inEvent = false;
      summary = null;
      dtstart = null;
      continue;
    }
    if (!inEvent) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const propPart = line.slice(0, colonIdx);
    const value = line.slice(colonIdx + 1);
    const propName = propPart.split(';')[0];

    if (propName === 'SUMMARY') {
      summary = value;
    } else if (propName === 'DTSTART') {
      dtstart = value;
    }
  }

  return out;
}

/**
 * Fetch the iCal file and parse it.
 * Throws on network failure or zero events parsed.
 */
export async function fetchNzHolidaysFromIcal(): Promise<ParsedHoliday[]> {
  const res = await fetch(ICAL_URL, {
    headers: {
      'User-Agent': 'NightNinjas-ShadowTracker/0.1 (+local-first)',
      Accept: 'text/calendar, text/plain',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('iCal fetch returned ' + res.status + ' ' + res.statusText);
  }

  const text = await res.text();
  const parsed = parseIcal(text);

  if (parsed.length === 0) {
    throw new Error('Parsed zero events from iCal — repo structure may have changed.');
  }

  return parsed;
}
