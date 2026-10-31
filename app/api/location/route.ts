/*
 * The signal's own line in. Vercel tags every request with where it came
 * from; this route reads those tags and hands back a place. It runs on my
 * domain, so blockers have nothing third-party to stop, and nothing is saved.
 * On localhost the tags don't exist, so it answers with an empty place.
 */

export function GET(request: Request) {
    const city = readHeader(request, "x-vercel-ip-city");
    const countryCode = readHeader(request, "x-vercel-ip-country");

    return Response.json(
        { city, country: countryName(countryCode) },
        { headers: { "Cache-Control": "no-store" } }
    );
}

function readHeader(request: Request, name: string): string | undefined {
    const value = request.headers.get(name);
    if (!value) return undefined;
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function countryName(code: string | undefined): string | undefined {
    if (!code) return undefined;
    try {
        return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
    } catch {
        return code;
    }
}