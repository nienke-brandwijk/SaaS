export default function Page() {
    return(
        <div className=" flex-col justify-center">
            <h1 className="text-4xl font-bold text-txtBold mb-6">
                1. Introduction
            </h1>
            
            <div className="flex flex-col gap-4">
                <p className="text-lg">
                    Knitting is a relaxing and creative craft that lets you turn simple yarn 
                    into something beautiful and useful, from cozy scarves to handmade sweaters. 
                    If you're new to knitting, don't worry! All you need to start are a pair of 
                    knitting needles, some yarn, and a bit of patience.
                </p>

                <p className="text-lg">
                    Begin by learning the basics: how to cast on (start your stitches), knit 
                    and purl (the two main stitches), and bind off (finish your work). Once 
                    you're comfortable with these, you'll be able to follow simple patterns 
                    and experiment with different textures and designs.
                </p>

                <p className="text-lg">
                    Understanding common knitting terms will make it much easier to follow 
                    patterns and tutorials, so we've put together a glossary to help you 
                    along the way. Whether you're just picking up your needles for the first 
                    time or brushing up on forgotten skills, you'll find everything you need 
                    here to begin your knitting journey with confidence.
                </p>
            </div>
        </div>
    )
}