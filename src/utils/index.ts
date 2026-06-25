


const PAGE_PATH_SEGMENTS: Record<string, string> = {
    Worksheets: "Arkusze",
    WorksheetDetails: "Egzamin",
};

export function createPageUrl(pageName: string) {
    const segment = PAGE_PATH_SEGMENTS[pageName] ?? pageName;
    return "/" + segment.replace(/ /g, "-");
}