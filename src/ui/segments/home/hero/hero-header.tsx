export default function HeroHeader({ showContent = true }: { showContent?: boolean }) {
  if (!showContent) {
    return null;
  }

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="font-mayday text-[9vw] leading-[0.9] font-black tracking-wide text-white uppercase">
        Our
        <br />
        collections
      </h2>
      <div className="font-whisper text-medium relative my-3 grid grid-cols-3 gap-x-12 border-y border-solid border-neutral-600 py-6 text-base text-neutral-400">
        <div>
          <p>
            Original typefaces for both Latin and Hangul. A creative bridge between Switzerland and
            South Korea.
          </p>
        </div>
        <div>
          <p>
            Unique fonts with distinctive concepts for our retail collection, from text typefaces to
            display ones.
          </p>
        </div>
        <div>
          <p>
            14 typefaces in total with different weight, width, optical size, and slant features.
          </p>
        </div>
      </div>
    </div>
  );
}
