export default function WordPage({ params }: { params: { slug: string } }) {
    // Convert slug back to word (replace hyphens with spaces)
    const word = params.slug.replace(/-/g, ' ');

    // Hier gaan we de echte dictionary ophalen
    const definitions: Record<string, string> = {
        'knit stitch': 'A knit stitch is the most basic stitch in knitting, created by inserting the needle through a loop and pulling yarn through.',
        'purl stitch': 'A purl stitch is the reverse of a knit stitch, creating a bumpy texture on the fabric.',
        'italian cast on': 'The Italian cast on is an elastic cast-on method that creates a stretchy edge, perfect for ribbing.',
        'w1r': 'Wrap 1 Right: A technique used in short rows where you wrap the yarn around a stitch.',
        'w1l': 'Wrap 1 Left: Similar to W1R but wrapping in the opposite direction.',
    };

    const definition = definitions[word.toLowerCase()] || 'Definition not found.';

    return (
        <div className="flex flex-col justify-center gap-6">
            <h1 className="text-4xl font-bold text-txtBold capitalize">
                {word}
            </h1>

            <p className="text-lg text-txtDefault">
                <span className="font-semibold">Definition:</span> {definition}
            </p>
        </div>
    );
}