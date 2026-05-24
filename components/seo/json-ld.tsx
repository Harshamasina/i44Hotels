/**
 * Renders a schema.org JSON-LD <script>. Data is first-party, but we still escape
 * "<" so a stray "</script>" in any field can't break out of the script element.
 */
export function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    );
}
