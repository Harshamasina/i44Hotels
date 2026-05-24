/**
 * Fetches a Google Font as TrueType bytes for next/og's ImageResponse (Satori
 * cannot read woff2). Requesting a `text` subset makes the css2 endpoint return a
 * `truetype` source, whose URL we parse out of the returned CSS. This runs during
 * static generation at build time, so the network fetch is fine. Mirrors Vercel's
 * official next/og Google-font recipe.
 */
export async function loadGoogleFont(
    family: string,
    weight: number,
    text: string,
): Promise<ArrayBuffer> {
    const url =
        `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}` +
        `&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const match = css.match(
        /src: url\((https:\/\/[^)]+)\) format\('(?:opentype|truetype)'\)/,
    );
    if (!match) throw new Error(`Could not load font: ${family} ${weight}`);
    const res = await fetch(match[1]);
    if (!res.ok) throw new Error(`Could not fetch font file: ${family} ${weight}`);
    return res.arrayBuffer();
}
