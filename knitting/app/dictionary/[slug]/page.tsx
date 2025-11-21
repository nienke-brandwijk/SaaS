type Props = {
  params: {
    slug: string;
  };
};

export default async function WordPage({ params }: Props) {
    // Convert slug back to word (replace hyphens with spaces)
    const word = params.slug.replace(/-/g, ' ');

    // Hier gaan we de echte dictionary ophalen
    const definitions: Record<string, string> = {
    'knit stitch': 'A knit stitch is the most basic stitch in knitting, created by inserting the needle through a loop and pulling yarn through.',
    'purl stitch': 'A purl stitch is the reverse of a knit stitch, creating a bumpy texture on the fabric.',
    'italian cast on': 'The Italian cast on is an elastic cast-on method that creates a stretchy edge, perfect for ribbing.',
    'w1r': 'Wrap 1 Right: A technique used in short rows where you wrap the yarn around a stitch.',
    'w1l': 'Wrap 1 Left: Similar to W1R but wrapping in the opposite direction.',
    'long tail cast on': 'A common cast-on method using a long strand of yarn that creates a neat and slightly elastic edge.',
    'provisional cast on': 'A temporary cast-on using scrap yarn that can later be removed to reveal live stitches.',
    'bind off': 'A finishing technique that secures stitches at the end of a project to prevent unraveling.',
    'k2tog': 'Knit Two Together: A decrease stitch that slants to the right.',
    'ssk': 'Slip, Slip, Knit: A left-leaning decrease formed by slipping two stitches knitwise and knitting them together.',
    'yo': 'Yarn Over: A technique that creates an extra stitch and a decorative hole (eyelet).',
    'm1l': 'Make One Left: A left-leaning increase by lifting the bar between stitches and knitting through the back loop.',
    'm1r': 'Make One Right: A right-leaning increase by lifting the bar between stitches and knitting through the front loop.',
    'tink': 'To unknit a stitch (knit backwards), usually to fix a mistake without ripping out rows.',
    'frog': 'To unravel multiple rows of knitting (“rip it, rip it”).',
    'gauge': 'The number of stitches and rows per inch; essential for ensuring a project’s final size.',
    'blocking': 'The process of shaping and setting knitted fabric using moisture, steam, or heat.',
    'short rows': 'A technique for creating shaping by knitting partial rows.',
    'stockinette stitch': 'A fabric made by alternating knit and purl rows, producing smooth V-shaped stitches on the right side.',
    'garter stitch': 'A fabric created by knitting every row, resulting in ridges on both sides.',
    'ribbing': 'A stretchy fabric created by alternating knit and purl stitches in vertical columns (e.g., K1P1 or K2P2).',
    'seed stitch': 'A textured stitch pattern created by alternating knit and purl stitches every stitch and every row.',
    'cable stitch': 'A stitch pattern created by crossing stitches over one another using a cable needle.',
    'slip stitch': 'A technique where a stitch is moved from the left needle to the right without being worked.',
    'selvedge stitch': 'The edge stitch of knitted fabric, often worked in a specific way for a neat edge.',
    'lace knitting': 'Knitting that incorporates yarn overs and decreases to create open, decorative patterns.',
    'fair isle': 'A colorwork technique using two colors per row to create stranded patterns.',
    'intarsia': 'A colorwork method for large blocks of color where yarns are not carried across the back.',
    'magic loop': 'A method of knitting small circumferences in the round using a long circular needle.',
    'dpn': 'Double-Pointed Needles: A set of needles used for knitting in the round on small circumferences.',
    'blocking mats': 'Foam mats used as a surface for pinning knitted fabric during blocking.',
    'notions': 'Small knitting tools such as stitch markers, tapestry needles, and scissors.',
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