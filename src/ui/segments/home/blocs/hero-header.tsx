export default function HeroHeader({
  showContent = true,
}: {
  showContent?: boolean;
}) {
  if (!showContent) {
    return null;
  }

  return (
    <div className="relative w-full flex flex-col">
      <h2 className="text-[9vw] text-white font-mayday font-black uppercase leading-[0.9] tracking-wide">
        Our
        <br />
        collections
      </h2>
      <div className="relative grid grid-cols-3 gap-x-12 text-neutral-400 font-whisper text-medium text-base my-3 py-6 border-y border-solid border-neutral-600">
        <div>
          <p>
            Original typefaces for both Latin and Hangul. A creative bridge
            between Switzerland and South Korea.
          </p>
        </div>
        <div>
          <p>
            Unique fonts with distinctive concepts for our retail collection,
            from text typefaces to display ones.
          </p>
        </div>
        <div>
          <p>
            14 typefaces in total with different weight, width, optical size,
            and slant features.
          </p>
        </div>
      </div>
    </div>
  );
}
