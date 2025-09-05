export default function AddBlock({
  addSection,
}: {
  addSection: (type: "one" | "two" | "three") => void;
}) {
  return (
    <div className="mt-8 flex w-full justify-center">
      <div className="font-whisper mt-10 w-[45%] rounded-xl border border-solid border-black px-8 py-5 text-center">
        <div className="mb-2 text-lg font-normal tracking-wider text-black uppercase">
          Add New Section
        </div>
        <div className="flex w-full flex-row justify-between gap-x-2">
          <button
            type="button"
            aria-label="Add 1 Column Section"
            onClick={() => addSection("one")}
            className="font-whisper cursor-pointer rounded-full border border-solid border-black bg-transparent px-8 py-2 pt-3 text-xl font-medium transition-colors duration-300 ease-in-out hover:bg-black hover:text-white"
          >
            1 Column
          </button>
          <button
            type="button"
            aria-label="Add 2 Columns Section"
            onClick={() => addSection("two")}
            className="font-whisper cursor-pointer rounded-full border border-solid border-black bg-transparent px-8 py-2 pt-3 text-xl font-medium transition-colors duration-300 ease-in-out hover:bg-black hover:text-white"
          >
            2 Columns
          </button>
          <button
            type="button"
            aria-label=""
            onClick={() => addSection("three")}
            className="font-whisper cursor-pointer rounded-full border border-solid border-black bg-transparent px-8 py-2 pt-3 text-xl font-medium transition-colors duration-300 ease-in-out hover:bg-black hover:text-white"
          >
            3 Columns
          </button>
        </div>
      </div>
    </div>
  );
}
