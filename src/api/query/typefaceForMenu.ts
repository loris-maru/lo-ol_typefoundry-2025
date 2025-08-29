export const typefacesForMenu = `*[_type == "typefaces"][] {
        _id,
        name,
        color,
        category,
        axis,
        axisNames,
        "slug": slug.current,
}`;
